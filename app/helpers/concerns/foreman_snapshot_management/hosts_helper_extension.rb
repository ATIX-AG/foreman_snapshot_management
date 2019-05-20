# frozen_string_literal: true

module ForemanSnapshotManagement
  module HostsHelperExtension
    def multiple_actions
      super + [[_('Create Snapshot'), select_multiple_host_snapshots_path]]
    end
  end
end
