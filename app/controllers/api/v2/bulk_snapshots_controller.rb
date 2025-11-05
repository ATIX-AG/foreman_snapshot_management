# frozen_string_literal: true

module Api
  module V2
    class BulkSnapshotsController < V2::BaseController
      SNAPSHOT_MODES = %w[full include_ram quiesce].freeze

      before_action :validate_hosts, :validate_snapshot, :validate_mode, only: :create

      api :POST, '/snapshots/bulk/create_snapshot', N_('Create snapshots for multiple hosts')
      param :host_ids, Array, of: Integer, desc: N_('Array of host IDs to create snapshots for'), required: true

      param :snapshot, Hash, desc: N_('Snapshot parameters'), required: true do
        param :name, String, desc: N_('Name of the snapshot'), required: true
        param :description, String, desc: N_('Description of the snapshot'), required: false
      end

      param :mode,
        SNAPSHOT_MODES,
        desc: N_('Snapshot mode: full (default), include_ram, or quiesce'),
        required: false

      def create
        include_ram, quiesce = resolve_mode(params[:mode])

        results = @hosts.map do |host|
          process_host(host, @snapshot_name, @snapshot_description, include_ram, quiesce)
        end

        render_results(results)
      end

      private

      def validate_mode
        mode = params[:mode]
        return true if mode.blank? || SNAPSHOT_MODES.include?(mode)

        render(
          json: {
            error: _('Invalid mode'),
            valid_modes: SNAPSHOT_MODES,
          },
          status: :unprocessable_entity
        )
        false
      end

      def validate_hosts
        host_ids = params[:host_ids]

        if host_ids.blank?
          render(
            json: { error: _('host_ids parameter is required and cannot be empty') },
            status: :unprocessable_entity
          )
          return false
        end

        unless host_ids.is_a?(Array)
          render(
            json: { error: _('host_ids must be an array') },
            status: :unprocessable_entity
          )
          return false
        end

        @requested_host_ids = host_ids.map(&:to_i)
        resource_base = Host.authorized("#{action_permission}_snapshots".to_sym, Host).friendly
        @hosts = resource_base.where(id: @requested_host_ids)

        found_ids = @hosts.pluck(:id)
        missing_ids = @requested_host_ids - found_ids

        return true if missing_ids.empty?

        render(
          json: {
            error: _('Some host_ids are invalid'),
            invalid_ids: missing_ids,
          },
          status: :unprocessable_entity
        )
        false
      end

      def validate_snapshot
        snap = params[:snapshot] || {}
        @snapshot_name = snap[:name].to_s.strip
        @snapshot_description = snap[:description].to_s

        return true if @snapshot_name.present?

        render(
          json: { error: _('snapshot.name is required') },
          status: :unprocessable_entity
        )
        false
      end

      def render_results(results)
        failed_hosts = results.select { |r| r[:status] == 'failed' }
        failed_count = failed_hosts.length

        status =
          if failed_count.zero?
            :ok
          else
            :unprocessable_entity
          end

        render(
          json: {
            results: results.map { |r| r.except(:errors) },
            total: results.length,
            success_count: results.length - failed_count,
            failed_count: failed_count,
            failed_hosts: failed_hosts,
          },
          status: status
        )
      end

      def resolve_mode(mode)
        case mode
        when 'include_ram'
          [true, false]
        when 'quiesce'
          [false, true]
        else
          [false, false]
        end
      end

      def process_host(host, name, description, include_ram, quiesce)
        snapshot = ForemanSnapshotManagement::Snapshot.new(
          name: name,
          description: description,
          include_ram: include_ram,
          quiesce: quiesce,
          host: host
        )

        if snapshot.create
          {
            host_id: host.id,
            host_name: host.name,
            status: 'success',
          }
        else
          errors = snapshot.errors.full_messages
          errors << quiesce_error_message if quiesce

          {
            host_id: host.id,
            host_name: host.name,
            status: 'failed',
            errors: errors,
          }
        end
      rescue StandardError => e
        Foreman::Logging.exception(
          "Failed to create snapshot for host #{host.name} (ID: #{host.id})",
          e
        )
        {
          host_id: host.id,
          host_name: host.name,
          status: 'failed',
          errors: [_('Snapshot creation failed: %s') % e.message],
        }
      end

      def quiesce_error_message
        _(
          'Unable to create VMWare Snapshot with Quiesce. Check Power and VMWare Tools status.'
        )
      end

      def action_permission
        :create
      end

      def resource_class
        ::ForemanSnapshotManagement::Snapshot
      end

      def resource_name
        'snapshot'
      end
    end
  end
end
