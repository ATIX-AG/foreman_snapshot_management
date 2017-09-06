module ForemanSnapshotManagement
  class SnapshotsController < ApplicationController
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
      # Create snapshot
      name = params['snapshot']['name']
      description = params['snapshot']['description'] || ''
      snapshot = Snapshot.new(host: @host, name: name, description: description)
      begin
        task = snapshot.create

        # Check state of Snapshot creation
        if task['task_state'] == 'success'
          status = _('Snapshot successfully created')
        else
          status = _('Error occurred while creating snapshot: %s') % task['task_state']
        end

        # Redirect to specific Host page
        redirect_to host_path(@host, anchor: 'snapshots'), flash: { notice: status }
      rescue
        logger.error 'Failed to take snapshot.'
        status = _('Error occurred while creating snapshot.')
        redirect_to host_path(@host, anchor: 'snapshots'), flash: { error: status }
      end
    end

    # Remove Snapshot
    #
    # This method removes a Snapshot from a given host.
    def destroy
      # Remove Snapshot
      task = @snapshot.destroy

      # Check state of Snapshot creation
      if task['task_state'] == 'success'
        status = 'Snapshot successfully deleted'
      else
        status = 'Error occurred while removing Snapshot: ' + task['task_state']
      end

      # Redirect to specific Host page
      redirect_to host_path(@host, anchor: 'snapshots'), flash: { notice: status }
    end

    # Revert Snapshot
    #
    # This method reverts a host to a given Snapshot.
    def revert
      # Revert Snapshot
      task = @snapshot.revert

      # Check state of Snapshot creation
      if task['state'] == 'success'
        status = _('VM successfully rolled back')
      else
        status = _('Error occurred while rolling back VM: %s') % task['state']
      end

      # Redirect to specific Host page
      redirect_to host_path(@host, anchor: 'snapshots'), flash: { notice: status }
    end

    # Update Snapshot
    #
    # This method renames a Snapshot from a given host.
    def update
      # Rename Snapshot
      @snapshot.name = params['snapshot']['name'] if params['snapshot']['name']
      @snapshot.description = params['snapshot']['description'] if params['snapshot']['description']
      begin
        task = @snapshot.save
        render json: { name: @snapshot.name, description: @snapshot.description }
      rescue
        logger.error "Failed to update snapshot #{@snapshot.id}."
        render json: { errors: _('Failed to update snapshot.') }, status: :unprocessable_entity
      end
    end

    # Find Host
    #
    # This method is responsible that methods of the controller know the current host.

    private

    def find_host
      @host = Host.find_by! name: params['host_id']
    rescue => e
      process_ajax_error e, 'Host not found!'
    end

    def check_snapshot_capability
      not_found unless @host.compute_resource && @host.compute_resource.capabilities.include?(:snapshots)
    end

    def enumerate_snapshots
      # Hash of Snapshot
      @snapshots = Snapshot.all_for_host @host
    end

    def find_snapshot
      @snapshot = Snapshot.find_for_host @host, params['id']
    end
  end
end
