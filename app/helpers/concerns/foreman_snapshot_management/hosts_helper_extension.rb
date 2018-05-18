module ForemanSnapshotManagement
  module HostsHelperExtension
    extend ActiveSupport::Concern

    included do
      alias_method_chain :multiple_actions, :snapshot_management
    end

    def multiple_actions_with_snapshot_management
      multiple_actions_without_snapshot_management + [[_('Create Snapshot'), select_multiple_host_snapshots_path]]
    end
  end
end
