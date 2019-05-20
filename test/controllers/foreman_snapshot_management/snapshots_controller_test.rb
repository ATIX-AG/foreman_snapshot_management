# frozen_string_literal: true

require 'test_helper'

module ForemanSnapshotManagement
  class SnapshotsControllerTest < ActionController::TestCase
    let(:tax_location) { Location.find_by_name('Location 1') }
    let(:tax_organization) { Organization.find_by_name('Organization 1') }
    let(:compute_resource) do
      cr = FactoryBot.create(:compute_resource, :vmware, :uuid => 'Solutions', :locations => [tax_location], organizations: [tax_organization])
      ComputeResource.find_by_id(cr.id)
    end
    let(:uuid) { '5032c8a5-9c5e-ba7a-3804-832a03e16381' }
    let(:uuid2) { 'a7169e20-74d3-4367-afc2-d355716e7555' }
    let(:host) { FactoryBot.create(:host, :managed, :compute_resource => compute_resource, :uuid => uuid) }
    let(:host2) { FactoryBot.create(:host, :managed, :compute_resource => compute_resource, :uuid => uuid2) }
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
        assert_includes flash[:notice] || flash[:success], 'Successfully created Snapshot.'
      end

      test 'create valid multiple' do
        post :create_multiple_host, params: { :host_ids => [host.id, host2.id], :snapshot => { :name => 'test' } }, session: set_session_user
        assert_redirected_to hosts_url
        assert_includes flash[:notice] || flash[:success], 'Created Snapshots for 2 hosts'
      end

      test 'create invalid' do
        ForemanSnapshotManagement::Snapshot.any_instance.stubs(:create).returns(false)
        post :create, params: { :host_id => host.to_param, :snapshot => { :name => nil } }, session: set_session_user
        assert_redirected_to host_url(host, :anchor => 'snapshots')
        assert_includes flash[:error], 'Error occurred while creating Snapshot'
      end

      test 'create invalid multiple' do
        ForemanSnapshotManagement::Snapshot.any_instance.stubs(:create).returns(false)
        post :create_multiple_host, params: { :host_ids => [host.id, host2.id], :snapshot => { :name => nil } }, session: set_session_user
        assert_redirected_to hosts_url
        assert_match(/^Error occurred while creating Snapshot for/, flash[:error])
      end
    end

    context 'DELETE #destroy' do
      test 'destroy successful' do
        delete :destroy, params: { :host_id => host.to_param, :id => snapshot_id }, session: set_session_user
        assert_redirected_to host_url(host, :anchor => 'snapshots')
        assert_includes flash[:notice] || flash[:success], 'Successfully deleted Snapshot.'
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
        assert_includes flash[:notice] || flash[:success], 'VM successfully rolled back.'
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
