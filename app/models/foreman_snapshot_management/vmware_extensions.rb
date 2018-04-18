module ForemanSnapshotManagement
  module VmwareExtensions
    extend ActiveSupport::Concern

    included do
      alias_method :capabilities_without_snapshotmgmt, :capabilities
      alias_method :capabilities, :capabilities_with_snapshotmgmt
    end

    # Extend VMWare's capabilities with snapshots.
    def capabilities_with_snapshotmgmt
      capabilities_without_snapshotmgmt + [:snapshots]
    end

    # Create a Snapshot.
    #
    # This method creates a Snapshot with a given name and optional description.
    def create_snapshot(uuid, name, description, include_ram = false)
      task = client.vm_take_snapshot('instance_uuid' => uuid, 'name' => name, 'description' => description, 'memory' => include_ram)
      task_successful?(task)
    rescue RbVmomi::Fault => e
      Foreman::Logging.exception('Error creating VMWare Snapshot', e)
      raise ::Foreman::WrappedException.new(e, N_('Unable to create VMWare Snapshot'))
    end

    # Remove Snapshot
    #
    # This method removes a Snapshot from a given host.
    def remove_snapshot(snapshot, remove_children)
      task = client.remove_snapshot('snapshot' => snapshot, 'removeChildren' => remove_children)
      task_successful?(task)
    rescue RbVmomi::Fault => e
      Foreman::Logging.exception('Error removing VMWare Snapshot', e)
      raise ::Foreman::WrappedException.new(e, N_('Unable to remove VMWare Snapshot'))
    end

    # Revert Snapshot
    #
    # This method revert a host to a given Snapshot.
    def revert_snapshot(snapshot)
      task = client.revert_to_snapshot(snapshot)
      task_successful?(task)
    rescue RbVmomi::Fault => e
      Foreman::Logging.exception('Error reverting VMWare Snapshot', e)
      raise ::Foreman::WrappedException.new(e, N_('Unable to revert VMWare Snapshot'))
    end

    # Update Snapshot
    #
    # This method renames a Snapshot from a given host.
    def update_snapshot(snapshot, name, description)
      client.rename_snapshot('snapshot' => snapshot, 'name' => name, 'description' => description)
      true
    rescue RbVmomi::Fault => e
      Foreman::Logging.exception('Error updating VMWare Snapshot', e)
      raise ::Foreman::WrappedException.new(e, N_('Unable to update VMWare Snapshot'))
    end

    # Get Snapshot
    #
    # This methods returns a specific Snapshot for a given host.
    def get_snapshot(server_id, snapshot_id)
      snapshot = client.snapshots(server_id: server_id).get(snapshot_id)
      # Workaround for https://github.com/fog/fog-vsphere/commit/d808255cd19c3d43d3227825f1e0d72d3f6ee6b9
      # Remove, when fog-vshpere 1.11 lands in foreman
      snapshot = snapshot.get_child(snapshot_id) while snapshot && snapshot.ref != snapshot_id
      snapshot
    end

    # Get Snapshots
    #
    # This methods returns Snapshots from a given host.
    def get_snapshots(server_id)
      client.snapshots(server_id: server_id).all(recursive: true)
    end

    private

    def task_successful?(task)
      task['task_state'] == 'success' || task['state'] == 'success'
    end
  end
end
