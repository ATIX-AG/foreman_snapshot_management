# frozen_string_literal: true

module ForemanSnapshotManagement
  module HostsHelper
    def snapshot_multiple_actions
      return [] unless can_create_snapshots?
      [{ action: [_('Create Snapshot'), select_multiple_host_snapshots_path], priority: 1000 }]
    end

    private

    def can_create_snapshots?
      User.current.can?(:create_snapshots)
    end
  end
end
