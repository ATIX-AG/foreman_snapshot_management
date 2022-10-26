# frozen_string_literal: true

module ForemanSnapshotManagement
  module ProxmoxExtensions
    # Extend Proxmox's capabilities with snapshots.
    def capabilities
      super + [:snapshots, :limit_snapshot_name_format]
    end

    # Create a Snapshot.
    #
    # This method creates a Snapshot with a given name and optional description.
    def create_snapshot(host, name, description, _include_ram = false)
      server = find_vm_by_uuid host.uuid
      raise _('Name must contain at least 2 characters starting with alphabet. Valid characters are A-Z a-z 0-9 _') unless /^[A-Za-z][\w]{1,}$/.match?(name)

      snapshot = server.snapshots.create(name: name)
      snapshot.description = description
      snapshot.update
    rescue StandardError => e
      Foreman::Logging.exception('Error creating Proxmox Snapshot', e)
      raise ::Foreman::WrappedException.new(e, N_('Unable to create Proxmox Snapshot'))
    end

    # Remove Snapshot
    #
    # This method removes a Snapshot from a given host.
    def remove_snapshot(snapshot)
      snapshot.destroy
    rescue StandardError => e
      Foreman::Logging.exception('Error removing Proxmox Snapshot', e)
      raise ::Foreman::WrappedException.new(e, N_('Unable to remove Proxmox Snapshot'))
    end

    # Revert Snapshot
    #
    # This method revert a host to a given Snapshot.
    def revert_snapshot(snapshot)
      snapshot.rollback
    rescue StandardError => e
      Foreman::Logging.exception('Error reverting Proxmox Snapshot', e)
      raise ::Foreman::WrappedException.new(e, N_('Unable to revert Proxmox Snapshot'))
    end

    # Update Snapshot
    #
    # This method renames a Snapshot from a given host.
    def update_snapshot(snapshot, name, description)
      raise _('Snapshot name cannot be changed') if snapshot.name != name

      snapshot.description = description
      snapshot.update
    rescue StandardError => e
      Foreman::Logging.exception('Error updating Proxmox Snapshot', e)
      raise ::Foreman::WrappedException.new(e, N_('Unable to update Proxmox Snapshot'))
    end

    # Get Snapshot
    #
    # This methods returns a specific Snapshot for a given host.
    def get_snapshot(host, snapshot_id)
      server = find_vm_by_uuid host.uuid
      snapshot = server.snapshots.get(snapshot_id)
      raw_to_snapshot(host, snapshot)
    end

    # Get Snapshot by name
    #
    # This method returns a specific Snapshot for a given host.
    def get_snapshot_by_name(host, name)
      server = find_vm_by_uuid host.uuid
      snapshot = server.snapshots.get(name)
      raw_to_snapshot(host, snapshot) if snapshot
    end

    # Get Snapshots
    #
    # This methods returns Snapshots for a given host.
    def get_snapshots(host)
      server = find_vm_by_uuid host.uuid
      server.snapshots.delete(server.snapshots.get('current'))
      server.snapshots.map do |snapshot|
        raw_to_snapshot(host, snapshot)
      end
    end

    private

    def raw_to_snapshot(host, raw_snapshot)
      if raw_snapshot
        Snapshot.new(
          host: host,
          id: raw_snapshot.name,
          raw_snapshot: raw_snapshot,
          name: raw_snapshot.name,
          description: raw_snapshot.description
        )
      end
    end
  end
end
