# frozen_string_literal: true

module ForemanSnapshotManagement
  module VmwareExtensions
    # Extend VMWare's capabilities with snapshots.
    def capabilities
      super + [:snapshots, :snapshot_include_ram, :editable_snapshot_name]
    end

    # Create a Snapshot.
    #
    # This method creates a Snapshot with a given name and optional description.
    def create_snapshot(host, name, description, include_ram = false)
      task = client.vm_take_snapshot('instance_uuid' => host.uuid, 'name' => name, 'description' => description, 'memory' => include_ram)
      task_successful?(task)
    rescue RbVmomi::Fault => e
      Foreman::Logging.exception('Error creating VMWare Snapshot', e)
      raise ::Foreman::WrappedException.new(e, N_('Unable to create VMWare Snapshot'))
    end

    # Remove Snapshot
    #
    # This method removes a Snapshot from a given host.
    def remove_snapshot(snapshot, remove_children = false)
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
    def get_snapshot(host, snapshot_id)
      raw_snapshot = client.snapshots(server_id: host.uuid).get(snapshot_id)
      raw_to_snapshot(host, raw_snapshot)
    end

    # Get Snapshot by name
    #
    # This method returns a specific Snapshot for a given host.
    def get_snapshot_by_name(host, name)
      raw_snapshot = nil
      client.snapshots(server_id: host.uuid).all(recursive: true).each do |snapshot|
        if name == snapshot.name
          raw_snapshot = snapshot
          break
        end
      end
      raw_to_snapshot(host, raw_snapshot)
    end

    # Get Snapshots
    #
    # This methods returns Snapshots for a given host.
    def get_snapshots(host)
      client.snapshots(server_id: host.uuid).all(recursive: true).map do |raw_snapshot|
        raw_to_snapshot(host, raw_snapshot)
      end
    end

    private

    def raw_to_snapshot(host, raw_snapshot, opts = {})
      if raw_snapshot
        Snapshot.new(
          host: host,
          id: raw_snapshot.ref,
          raw_snapshot: raw_snapshot,
          name: raw_snapshot.name,
          description: raw_snapshot.description,
          parent: opts[:parent],
          create_time: raw_snapshot.create_time
        )
      end
    end

    def task_successful?(task)
      task['task_state'] == 'success' || task['state'] == 'success'
    end
  end
end
