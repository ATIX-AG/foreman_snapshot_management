require 'date'

module ForemanSnapshotManagement
  class Snapshot
    extend ActiveModel::Callbacks
    include ActiveModel::Conversion
    include ActiveModel::Model
    include ActiveModel::Dirty
    include ActiveModel::ForbiddenAttributesProtection

    define_model_callbacks :create, :save, :destroy, :revert
    attr_accessor :id, :raw_snapshot, :parent
    attr_writer :create_time
    attr_reader :name, :description, :include_ram, :host_id
    define_attribute_methods :name, :description, :include_ram

    def self.all_for_host(host)
      host.compute_resource.get_snapshots(host.uuid).map do |raw_snapshot|
        new_from_vmware(host, raw_snapshot)
      end
    end

    def self.find_for_host(host, id)
      raw_snapshot = host.compute_resource.get_snapshot(host.uuid, id)
      new_from_vmware(host, raw_snapshot) if raw_snapshot
    end

    def self.new_from_vmware(host, raw_snapshot, opts = {})
      new(
        host: host,
        id: raw_snapshot.ref,
        raw_snapshot: raw_snapshot,
        name: raw_snapshot.name,
        description: raw_snapshot.description,
        parent: opts[:parent],
        create_time: raw_snapshot.create_time
      )
    end

    def children
      return [] unless raw_snapshot
      child_snapshots = raw_snapshot.child_snapshots.flat_map do |child_snapshot|
        self.class.new_from_vmware(host, child_snapshot, parent: self)
      end
      child_snapshots + child_snapshots.flat_map(&:children)
    end

    def inspect
      "#<#{self.class}:0x#{self.__id__.to_s(16)} name=#{name} id=#{id} description=#{description} host_id=#{host_id} parent=#{parent.try(:id)} children=#{children.map(&:id).inspect}>"
    end

    def to_s
      _('Snapshot')
    end

    def formatted_create_time
      create_time.strftime('%F %H:%M')
    end

    def persisted?
      @id.present?
    end

    def name=(value)
      name_will_change! unless value == @name
      @name = value
    end

    def description=(value)
      description_will_change! unless value == @description
      @description = value
    end

    def include_ram=(value)
      raise Exception('Cannot modify include_ram on existing snapshots.') if persisted?
      @include_ram = value
    end

    # host accessors
    def host
      @host ||= Host.find(@host_id)
    end

    def host_id=(host_id)
      return if @host_id == host_id
      @host_id = host_id
      @host = nil
    end

    def host=(host)
      return if @host_id == host.id
      @host_id = host.id
      @host = host
    end

    def create_time
      raw_snapshot.try(:create_time)
    end

    def assign_attributes(new_attributes)
      attributes = new_attributes.stringify_keys
      attributes = sanitize_for_mass_assignment(attributes)
      attributes.each do |k, v|
        public_send("#{k}=", v)
      end
    end

    def update_attributes(new_attributes)
      assign_attributes(new_attributes)
      save if changed?
    end

    # crud
    def create
      run_callbacks(:create) do
        handle_snapshot_errors do
          host.audit_comment = "Create snapshot #{name}"
          host.save!
          host.compute_resource.create_snapshot(host.uuid, name, description, include_ram)
          changes_applied
        end
      end
    end

    def save
      run_callbacks(:save) do
        handle_snapshot_errors do
          host.audit_comment = "Update snapshot #{name}"
          host.save!
          host.compute_resource.update_snapshot(raw_snapshot, name, description)
          changes_applied
        end
      end
    end

    def destroy
      run_callbacks(:destroy) do
        result = handle_snapshot_errors do
          host.audit_comment = "Destroy snapshot #{name}"
          host.save!
          result = host.compute_resource.remove_snapshot(raw_snapshot, false)
        end
        @id = nil
        result
      end
    end

    def revert
      run_callbacks(:revert) do
        handle_snapshot_errors do
          host.audit_comment = "Revert snapshot #{name}"
          host.save!
          host.compute_resource.revert_snapshot(raw_snapshot)
        end
      end
    end

    private

    def handle_snapshot_errors
      yield
    rescue Foreman::WrappedException => e
      errors.add(:base, e.wrapped_exception.message)
      false
    end
  end
end
