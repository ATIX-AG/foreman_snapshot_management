# frozen_string_literal: true

module ForemanSnapshotManagement
  module Extensions
    module BulkHostsManager
      extend ActiveSupport::Concern

      SNAPSHOT_MODES = %w[full include_ram quiesce].freeze
      QUIESCE_ERROR_MESSAGE =
        _('Unable to create VMWare Snapshot with Quiesce. Check Power and VMWare Tools status.').freeze

      def create_snapshots(name:, description:, mode:)
        include_ram, quiesce = resolve_mode(mode)

        @hosts.map do |host|
          process_snapshot_for_host(
            host: host,
            name: name,
            description: description,
            include_ram: include_ram,
            quiesce: quiesce
          )
        end
      end

      private

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

      def process_snapshot_for_host(host:, name:, description:, include_ram:, quiesce:)
        validation_error = validate_host(host)
        return validation_error if validation_error

        create_snapshot_for_host(host, name, description, include_ram, quiesce)
      rescue ActiveRecord::RecordNotFound => e
        handle_record_not_found(host, e)
      rescue StandardError => e
        handle_snapshot_error(host, e)
      end

      def validate_host(host)
        if host.compute_resource.nil?
          return {
            host_id: host.id,
            host_name: host.name,
            status: 'failed',
            errors: [_('Host has no compute resource, cannot create snapshot.')],
          }
        end

        return if host.uuid.present?

        {
          host_id: host.id,
          host_name: host.name,
          status: 'failed',
          errors: [_('Host has no UUID, cannot create snapshot.')],
        }
      end

      def create_snapshot_for_host(host, name, description, include_ram, quiesce)
        snapshot = ::ForemanSnapshotManagement::Snapshot.new(
          name: name,
          description: description,
          include_ram: include_ram,
          quiesce: quiesce,
          host: host
        )

        if snapshot.create
          { host_id: host.id, host_name: host.name, status: 'success' }
        else
          errors = snapshot.errors.full_messages
          errors << QUIESCE_ERROR_MESSAGE if quiesce
          { host_id: host.id, host_name: host.name, status: 'failed', errors: errors }
        end
      end

      def handle_record_not_found(host, exception)
        ::Foreman::Logging.exception(
          "Failed to create snapshot for host #{host.name} (ID: #{host.id})",
          exception
        )

        cr_name = host.compute_resource&.name
        cr_name = "#{cr_name} " if cr_name.present?

        msg =
          _('VM details could not be retrieved from compute resource %s. The VM may be missing/deleted or inaccessible.') % cr_name

        {
          host_id: host.id,
          host_name: host.name,
          status: 'failed',
          errors: [msg],
        }
      end

      def handle_snapshot_error(host, exception)
        ::Foreman::Logging.exception(
          "Failed to create snapshot for host #{host.name} (ID: #{host.id})",
          exception
        )

        {
          host_id: host.id,
          host_name: host.name,
          status: 'failed',
          errors: [_('Snapshot creation failed: %s') % exception.message],
        }
      end
    end
  end
end
