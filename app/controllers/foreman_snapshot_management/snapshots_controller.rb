module ForemanSnapshotManagement
  class SnapshotsController < ApplicationController
    include Foreman::Controller::ActionPermissionDsl
    include ::Foreman::Controller::Parameters::Snapshot

    MULTIPLE_ACTIONS = %w[select_multiple_host create_multiple_host].freeze

    before_action :find_hosts, only: MULTIPLE_ACTIONS
    before_action :find_host, except: MULTIPLE_ACTIONS
    before_action :check_snapshot_capability, except: MULTIPLE_ACTIONS
    before_action :check_multiple_snapshot_capability, only: MULTIPLE_ACTIONS
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

    define_action_permission ['select_multiple_host', 'create_multiple_host'], :create
    def select_multiple_host; end

    def create_multiple_host
      data = snapshot_params
      snapshots_created = 0
      errors = []
      @hosts.each do |h|
        s = Snapshot.new(data.merge(host: h))
        if s.create
          snapshots_created += 1
        else
          errors << [h.name, s.errors.full_messages.to_sentence]
        end
      end
      error _('Error occurred while creating Snapshot for<br /><dl>%s</dl>') % errors.map { |e| "<dt>#{e[0]}</dt><dd>#{e[1]}</dd>" }.join('<br />') unless errors.empty?
      if snapshots_created > 0
        msg = _('Created %{snapshots} for %{num} %{hosts}') % {
          snapshots: n_('Snapshot', 'Snapshots', snapshots_created),
          num: snapshots_created,
          hosts: n_('host', 'hosts', snapshots_created)
        }
        # for backwards compatibility
        if respond_to? :success
          success msg
        else
          notice msg
        end
      end
      redirect_back_or_to hosts_path
    end

    private

    def snapshot_params
      params.require(:snapshot).permit(:name, :description, :include_ram)
    end

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

    def find_hosts
      resource_base = Host.authorized("#{action_permission}_snapshots".to_sym, Host).friendly

      # Lets search by name or id and make sure one of them exists first
      @hosts = resource_base.search_for(params[:search]) if params.key?(:search)
      @hosts ||= resource_base.where('hosts.id IN (?) or hosts.name IN (?)', params[:host_ids], params[:host_names]) if params.key?(:host_names) || params.key?(:host_ids)

      if @hosts.empty?
        error _('No hosts were found with that id, name or query filter')
        redirect_to(hosts_path)
        return false
      end

      @hosts
    rescue StandardError => error
      message = _('Something went wrong while selecting hosts - %s') % error
      error(message)
      Foreman::Logging.exception(message, error)
      redirect_to hosts_path
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

    def check_multiple_snapshot_capability
      capable_hosts = @hosts.select { |h| h.capabilities.include?(:snapshots) }
      if capable_hosts.empty?
        warning _('No capable hosts found.')
        @hosts = Host.where('false')
      else
        @hosts = Host.where('hosts.id IN (?)', capable_hosts.map(&:id))
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
