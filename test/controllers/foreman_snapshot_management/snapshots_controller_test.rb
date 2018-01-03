require 'test_helper'

module ForemanSnapshotManagement
  class SnapshotsControllerTest < ActionController::TestCase
    let(:compute_resource) do
      cr = FactoryBot.create(:compute_resource, :vmware, :uuid => 'Solutions')
      ComputeResource.find_by_id(cr.id)
    end
    let(:uuid) { '5032c8a5-9c5e-ba7a-3804-832a03e16381' }
    let(:host) { FactoryBot.create(:host, :managed, :compute_resource => compute_resource, :uuid => uuid) }
    let(:snapshot_id) { 'snapshot-0101' }
    setup { ::Fog.mock! }
    teardown { ::Fog.unmock! }

    context 'GET #index' do
      test 'should get index' do
        get :index, params: { :host_id => host.to_param }, session: set_session_user
        assert_response :success
        assert_not_nil assigns(:snapshots)
        assert_template 'foreman_snapshot_management/snapshots/_index'
      end
    end

    context 'POST #create' do
      test 'create valid' do
        post :create, params: { :host_id => host.to_param, :snapshot => { :name => 'test' } }, session: set_session_user
        assert_redirected_to host_url(host, :anchor => 'snapshots')
        assert_includes flash[:notice], 'Successfully created Snapshot.'
      end

      test 'create invalid' do
        ForemanSnapshotManagement::Snapshot.any_instance.stubs(:create).returns(false)
        post :create, params: { :host_id => host.to_param, :snapshot => { :name => nil } }, session: set_session_user
        assert_redirected_to host_url(host, :anchor => 'snapshots')
        assert_includes flash[:error], 'Error occurred while creating Snapshot'
      end
    end

    context 'DELETE #destroy' do
      test 'destroy successful' do
        delete :destroy, params: { :host_id => host.to_param, :id => snapshot_id }, session: set_session_user
        assert_redirected_to host_url(host, :anchor => 'snapshots')
        assert_includes flash[:notice], 'Successfully deleted Snapshot.'
      end

      test 'destroy with error' do
        ForemanSnapshotManagement::Snapshot.any_instance.stubs(:destroy).returns(false)
        delete :destroy, params: { :host_id => host.to_param, :id => snapshot_id }, session: set_session_user
        assert_redirected_to host_url(host, :anchor => 'snapshots')
        assert_includes flash[:error], 'Error occurred while removing Snapshot'
      end
    end

    context 'PUT #revert' do
      test 'revert successful' do
        put :revert, params: { :host_id => host.to_param, :id => snapshot_id }, session: set_session_user
        assert_redirected_to host_url(host, :anchor => 'snapshots')
        assert_includes flash[:notice], 'VM successfully rolled back.'
      end

      test 'revert with error' do
        ForemanSnapshotManagement::Snapshot.any_instance.stubs(:revert).returns(false)
        put :revert, params: { :host_id => host.to_param, :id => snapshot_id }, session: set_session_user
        assert_redirected_to host_url(host, :anchor => 'snapshots')
        assert_includes flash[:error], 'Error occurred while rolling back VM'
      end
    end

    context 'PUT #update' do
      test 'update successful' do
        data = { 'name' => 'test 2', 'description' => '' }
        put :update, params: { :host_id => host.to_param, :id => snapshot_id, :snapshot => data }, session: set_session_user
        assert_response :success
        body = ActiveSupport::JSON.decode(@response.body)
        assert_equal(data, body)
      end

      test 'update with error' do
        ForemanSnapshotManagement::Snapshot.any_instance.stubs(:save).returns(false)
        put :update, params: { :host_id => host.to_param, :id => snapshot_id, :snapshot => { :name => 'test 2' } }, session: set_session_user
        assert_response :unprocessable_entity
      end
    end
  end
end
