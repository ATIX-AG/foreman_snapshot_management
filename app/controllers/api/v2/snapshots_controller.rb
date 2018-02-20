module Api
  module V2
    class SnapshotsController < V2::BaseController
      include Api::Version2
      include Foreman::Controller::Parameters::Snapshot

      before_action :find_required_nested_object
      before_action :check_snapshot_capability
      before_action :find_resource, :only => %w[show update destroy revert]

      api :GET, 'hosts/:host_id/snapshots/', N_('List all snapshots')
      param :host_id, :identifier_dottable, :required => true
      def index
        @snapshots = resource_scope_for_index
      end

      api :GET, '/hosts/:host_id/snapshots/:id', 'Show a snapshot'
      param :host_id, :identifier_dottable, :required => true
      param :id, :identifier_dottable, :required => true

      def show; end

      def_param_group :snapshot do
        param :snapshot, Hash, :required => true, :action_aware => true do
          param :name, String, :required => true, :desc => N_('Name of this snapshot')
          param :description, String, :desc => N_('Description of this snapshot')
        end
      end

      api :POST, '/hosts/:host_id/snapshots/', N_('Create a snapshot')
      param :host_id, :identifier_dottable, :required => true
      param :include_ram, :bool, :default_value => false, :desc => N_('Whether to include the RAM state in the snapshot')
      param_group :snapshot, :as => :create

      def create
        @snapshot = resource_class.new(snapshot_params.to_h.merge(host: @nested_obj).merge(include_ram: params[:include_ram]))
        process_response @snapshot.save
      end

      api :PUT, '/hosts/:host_id/snapshots/:id/', N_('Update a snapshot')
      param :host_id, :identifier_dottable, :required => true
      param :id, :identifier_dottable, :required => true
      param_group :snapshot

      def update
        process_response @snapshot.update_attributes(snapshot_params)
      end

      api :DELETE, '/hosts/:host_id/snapshots/:id', N_('Delete a snapshot')
      param :host_id, :identifier_dottable, :required => true
      param :id, :identifier_dottable, :required => true

      def destroy
        process_response @snapshot.destroy
      end

      api :PUT, '/hosts/:host_id/snapshots/:id/revert', N_('Revert Host to a snapshot')
      param :host_id, :identifier_dottable, :required => true
      param :id, :identifier_dottable, :required => true

      def revert
        process_response @snapshot.revert
      end

      private

      def resource_scope(_options = {})
        # TODO: Ask host for snapshots
        @resource_scope ||= resource_class.all_for_host(@nested_obj)
      end

      def resource_scope_for_index
        resource_scope.paginate(paginate_options)
      end

      def resource_class
        ::ForemanSnapshotManagement::Snapshot
      end

      def find_resource
        @snapshot = resource_class.find_for_host(@nested_obj, params[:id])
        not_found unless @snapshot
      end

      def check_snapshot_capability
        not_found unless @nested_obj.compute_resource && @nested_obj.compute_resource.capabilities.include?(:snapshots)
      end

      def action_permission
        case params[:action]
        when 'revert'
          :revert
        else
          super
        end
      end

      def parent_permission(child_permission)
        case child_permission.to_s
        when 'revert'
          :edit
        else
          super
        end
      end
    end
  end
end
