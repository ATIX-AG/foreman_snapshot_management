# frozen_string_literal: true

module Api
  module V2
    class BulkSnapshotsController < V2::BaseController
      include ::Api::V2::BulkHostsExtension

      SNAPSHOT_MODES = ForemanSnapshotManagement::Extensions::BulkHostsManager::SNAPSHOT_MODES

      before_action :validate_snapshot, :validate_mode, :find_snapshotable_hosts, only: :create

      api :POST, '/snapshots/bulk/create_snapshot', N_('Create snapshots for multiple hosts')

      param :organization_id, :number, required: true, desc: N_('ID of the organization')

      param :included, Hash, required: true, action_aware: true do
        param :search, String, required: false,
          desc: N_('Search string for hosts to perform an action on')
        param :ids, Array, required: false,
          desc: N_('List of host ids to perform an action on')
      end

      param :excluded, Hash, required: true, action_aware: true do
        param :ids, Array, required: false,
          desc: N_('List of host ids to exclude and not run an action on')
      end

      param :snapshot, Hash, desc: N_('Snapshot parameters'), required: true do
        param :name, String, desc: N_('Name of the snapshot'), required: true
        param :description, String, desc: N_('Description of the snapshot'), required: false
      end

      param :mode,
        SNAPSHOT_MODES,
        desc: N_('Snapshot mode: full (default), include_ram, or quiesce'),
        required: false

      def create
        results = ::BulkHostsManager.new(hosts: @hosts).create_snapshots(
          name: @snapshot_name,
          description: @snapshot_description,
          mode: params[:mode]
        )

        render_results(results)
      end

      private

      def find_snapshotable_hosts
        find_bulk_hosts(:create_snapshots, params)
      end

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
        status = failed_count.zero? ? :ok : :unprocessable_entity

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

      def resource_class
        ::ForemanSnapshotManagement::Snapshot
      end

      def resource_name
        'snapshot'
      end
    end
  end
end
