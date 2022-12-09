# frozen_string_literal: true

require 'date'

module ForemanSnapshotManagement
  class Snapshot
    extend ActiveModel::Callbacks
    extend ActiveModel::Naming
    include ActiveModel::Conversion
    include ActiveModel::Model
    include ActiveModel::Dirty
    include ActiveModel::ForbiddenAttributesProtection

    define_model_callbacks :create, :save, :destroy, :revert
    attr_accessor :id, :raw_snapshot, :parent, :snapshot_mode
    attr_writer :create_time, :quiesce
    attr_reader :name, :description, :include_ram, :host_id, :quiesce
    define_attribute_methods :name, :description, :include_ram

    def self.model_name
      Struct.new(:name, :klass, :singular, :plural, :element,
                 :human, :collection, :param_key, :i18n_key, :route_key, :singular_route_key).new(
                   'ForemanSnapshotManagement::Snapshot', ForemanSnapshotManagement::Snapshot,
                   'foreman_snapshot_management_snapshot', 'foreman_snapshot_management_snapshots',
                   'snapshot', 'Snapshot', 'foreman_snapshot_management/snapshots',
                   'snapshot', :'foreman_snapshot_management/snapshot', 'foreman_snapshot_management_snapshots',
                   'foreman_snapshot_management_snapshot'
                 )
    end

    def self.any?
      true
    end

    def self.new_for_host(host)
      host.compute_resource.new_snapshot(host)
    end

    def self.all_for_host(host)
      host.compute_resource.get_snapshots(host)
    end

    def self.find_for_host(host, id)
      host.compute_resource.get_snapshot(host, id)
    end

    def self.find_for_host_by_name(host, name)
      host.compute_resource.get_snapshot_by_name(host, name)
    end

    def inspect
      "#<#{self.class}:0x#{self.__id__.to_s(16)} name=#{name} id=#{id} description=#{description} host_id=#{host_id} parent=#{parent.try(:id)}>"
    end

    def to_s
      _('Snapshot')
    end

    def formatted_create_time
      create_time&.strftime('%F %H:%M')
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

    def update(new_attributes)
      assign_attributes(new_attributes)
      save if changed?
    end

    # crud
    def create
      run_callbacks(:create) do
        handle_snapshot_errors do
          host.audit_comment = "Create snapshot #{name}"
          host.save!
          host.compute_resource.create_snapshot(host, name, description, include_ram, quiesce)
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
          result = host.compute_resource.remove_snapshot(raw_snapshot)
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
      true
    rescue Foreman::WrappedException => e
      errors.add(:base, e.wrapped_exception.message)
      false
    rescue ActiveRecord::RecordInvalid => e
      errors.add(:base, e.message)
      false
    end
  end
end
