module ForemanSnapshotManagement
  module VmwareExtensions
    extend ActiveSupport::Concern

    # Create a Snapshot.
    #
    # This method creates a Snapshot with a given name and optional description.
    def create_snapshot(uuid, name, description)
      client.vm_take_snapshot('instance_uuid' => uuid, 'name' => name, 'description' => description)
    end

    # Remove Snapshot
    #
    # This method removes a Snapshot from a given host.
    def remove_snapshot(snapshot, removeChildren)
      client.remove_snapshot('snapshot' => snapshot, 'removeChildren' => removeChildren)
    end

    # Revert Snapshot
    #
    # This method revert a host to a given Snapshot.
    def revert_snapshot(snapshot)
      client.revert_to_snapshot(snapshot)
    end

    # Update Snapshot
    #
    # This method renames a Snapshot from a given host.
    def update_snapshot(snapshot, name, description)
      client.rename_snapshot('snapshot' => snapshot, 'name' => name, 'description' => description)
    end

    # Get Snapshots
    #
    # This methods returns Snapshots from a given host.
    def get_snapshots(server_id)
      client.snapshots(server_id: server_id)
    end
  end
end
