module ForemanSnapshotManagement
  class SnapshotsController < ApplicationController
    include ::Foreman::Controller::Parameters::Snapshot

    before_action :find_host
    before_action :check_snapshot_capability
    before_action :enumerate_snapshots, only: [:index]
    before_action :find_snapshot, only: %i[destroy revert update]
    helper_method :xeditable?

    def xeditable?(_object = nil)
      true
    end

    def index
      @new_snapshot = Snapshot.new(host: @host)
      render partial: 'index'
    end

    # Create a Snapshot.
    #
    # This method creates a Snapshot with a given name and optional description.
    def create
      @snapshot = Snapshot.new(snapshot_params.merge(host: @host).merge(include_ram: params[:snapshot][:include_ram]))

      if @snapshot.create
        process_success
      else
        msg = _('Error occurred while creating Snapshot: %s') % @snapshot.errors.full_messages.to_sentence
        process_error :error_msg => msg
      end
    end

    # Remove Snapshot
    #
    # This method removes a Snapshot from a given host.
    def destroy
      if @snapshot.destroy
        process_success
      else
        msg = _('Error occurred while removing Snapshot: %s') % @snapshot.errors.full_messages.to_sentence
        process_error :error_msg => msg
      end
    end

    # Revert Snapshot
    #
    # This method reverts a host to a given Snapshot.
    def revert
      if @snapshot.revert
        process_success :success_msg => _('VM successfully rolled back.')
      else
        msg = _('Error occurred while rolling back VM: %s') % @snapshot.errors.full_messages.to_sentence
        process_error :error_msg => msg
      end
    end

    # Update Snapshot
    #
    # This method renames a Snapshot from a given host.
    def update
      if @snapshot.update_attributes(snapshot_params)
        render json: { name: @snapshot.name, description: @snapshot.description }
      else
        msg = _('Failed to update Snapshot: %s') % @snapshot.errors.full_messages.to_sentence
        render json: { errors: msg }, status: :unprocessable_entity
      end
    end

    private

    # Find Host
    #
    # This method is responsible that methods of the controller know the current host.

    def find_host
      host_id = params[:host_id]
      if host_id.blank?
        not_found
        return false
      end
      @host = Host.authorized("#{action_permission}_snapshots".to_sym, Host).friendly.find(host_id)
      return @host if @host
      not_found
      false
    end

    def action_permission
      case params[:action]
      when 'revert'
        :revert
      else
        super
      end
    end

    def check_snapshot_capability
      not_found unless @host.compute_resource && @host.compute_resource.capabilities.include?(:snapshots)
    end

    def enumerate_snapshots
      # Array of Snapshot Objects
      @snapshots = Snapshot.all_for_host(@host)
    end

    def find_snapshot
      @snapshot = Snapshot.find_for_host(@host, params['id'])
      not_found unless @snapshot
    end

    def process_success(hash = {})
      hash[:success_redirect] ||= host_path(@host, anchor: 'snapshots')
      super(hash)
    end

    def process_error(hash = {})
      hash[:redirect] ||= host_path(@host, anchor: 'snapshots')
      super(hash)
    end
  end
end
