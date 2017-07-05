module ForemanSnapshotManagement
  class Snapshot
    extend ActiveModel::Callbacks
    include ActiveModel::Conversion
    include ActiveModel::Model
    include ActiveModel::Dirty

    define_model_callbacks :create, :save, :destroy, :revert
    attr_accessor :id, :vmware_snapshot, :name, :description, :host_id

    def self.add_snapshot_with_children(snapshots, host, vmware_snapshot)
      snapshots[vmware_snapshot.ref] = new_from_vmware(host, vmware_snapshot)
      vmware_snapshot.child_snapshots.each do |snap|
        add_snapshot_with_children(snapshots, host, snap)
      end
    end

    def self.all_for_host(host)
      snapshots = {}
      root_snapshot = host.compute_resource.get_snapshots(host.uuid).first
      add_snapshot_with_children(snapshots, host, root_snapshot) if root_snapshot
      snapshots
    end

    def self.find_for_host(host, id)
      all_for_host(host)[id]
    end

    def self.new_from_vmware(host, vmware_snapshot)
      new({host: host, id: vmware_snapshot.ref, vmware_snapshot: vmware_snapshot, name: vmware_snapshot.name, description: vmware_snapshot.description})
    end

    def persisted?
      @id.present?
    end

    # host accessors
    def host
      Host.find(@host_id)
    end

    def host=(host)
      @host_id = host.id
    end

    # crud
    def create
      run_callbacks(:create) do
        host.compute_resource.create_snapshot(host.uuid, name, description)
      end
    end

    def save
      run_callbacks(:save) do
        host.compute_resource.update_snapshot(vmware_snapshot, name, description)
      end
    end

    def destroy
      run_callbacks(:destroy) do
        result = host.compute_resource.remove_snapshot(vmware_snapshot, false)
        id = nil
        result
      end
    end

    def revert
      run_callbacks(:revert) do
        host.compute_resource.revert_snapshot(vmware_snapshot)
      end
    end

  end
end
