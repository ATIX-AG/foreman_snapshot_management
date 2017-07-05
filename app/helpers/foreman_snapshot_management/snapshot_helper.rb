module ForemanSnapshotManagement
  module SnapshotHelper

    def foreman_snapshot_management_snapshot_path(snapshot)
      host_snapshot_path(host_id: snapshot.host, id: snapshot.id)
    end

  end
end
