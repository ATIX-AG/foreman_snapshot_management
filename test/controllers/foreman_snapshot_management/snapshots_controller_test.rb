# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanSnapshotManagement
  class SnapshotsControllerTest < ActionController::TestCase
    let(:tax_location) { Location.find_by(name: 'Location 1') }
    let(:tax_organization) { Organization.find_by(name: 'Organization 1') }
    let(:compute_resource) do
      cr = FactoryBot.create(:compute_resource, :vmware, :uuid => 'Solutions', :locations => [tax_location], organizations: [tax_organization])
      ComputeResource.find_by(id: cr.id)
    end
    let(:uuid) { '5032c8a5-9c5e-ba7a-3804-832a03e16381' }
    let(:uuid2) { '502916a3-b42e-17c7-43ce-b3206e9524dc' }
    let(:host) { FactoryBot.create(:host, :managed, :compute_resource => compute_resource, :uuid => uuid) }
    let(:host2) { FactoryBot.create(:host, :managed, :compute_resource => compute_resource, :uuid => uuid2) }
    let(:snapshot_id) { 'snapshot-0101' }

    if defined?(TEST_PROXMOX)
      let(:vmid) { '1_100' }
      let(:proxmox_compute_resource) do
        FactoryBot.create(:proxmox_cr)
        ComputeResource.find_by(type: 'ForemanFogProxmox::Proxmox')
      end
      let(:proxmox_host) { FactoryBot.create(:host, :managed, :compute_resource => proxmox_compute_resource, :uuid => vmid) }
      let(:proxmox_snapshot) { 'snapshot1' }
    end

    setup { ::Fog.mock! }
    teardown { ::Fog.unmock! }

    context 'GET #index' do
      test 'should get VMware snapshot index' do
        get :index, params: { :host_id => host.to_param }, session: set_session_user
        assert_response :success
        assert_not_nil assigns(:snapshots)
        assert_template 'foreman_snapshot_management/snapshots/_index'
      end

      if defined?(TEST_PROXMOX)
        test 'should get Proxmox index' do
          Host::Managed.any_instance.stubs(:vm_exists?).returns(false)
          get :index, params: { :host_id => proxmox_host.to_param }, session: set_session_user
          assert_response :success
          assert_not_nil assigns(:snapshots)
          assert_template 'foreman_snapshot_management/snapshots/_index'
        end
      end
    end

    context 'POST #create' do
      test 'create valid VMware snapshot' do
        post :create, params: { :host_id => host.to_param, :snapshot => { :name => 'test' } }, session: set_session_user
        assert_redirected_to host_url(host, :anchor => 'snapshots')
        assert_includes flash[:notice] || flash[:success], 'Successfully created Snapshot.'
      end

      if defined?(TEST_PROXMOX)
        test 'create valid proxmox snapshot' do
          Host::Managed.any_instance.stubs(:vm_exists?).returns(false)
          post :create, params: { :host_id => proxmox_host.to_param, :snapshot => { :name => 'test' } }, session: set_session_user
          assert_redirected_to host_url(proxmox_host, :anchor => 'snapshots')
          assert_includes flash[:notice] || flash[:success], 'Successfully created Snapshot.'
        end
      end

      test 'create valid multiple with memory' do
        post :create_multiple_host, params: { :host_ids => [host.id, host2.id], :snapshot => { :name => 'test', :snapshot_mode => 'memory' } }, session: set_session_user
        puts @response
        assert_redirected_to hosts_url
        assert_includes flash[:notice] || flash[:success], 'Created Snapshots for 2 hosts'
      end

      test 'create valid multiple with quiesce' do
        post :create_multiple_host, params: { :host_ids => [host.id], :snapshot => { :name => 'test', :snapshot_mode => 'quiesce' } }, session: set_session_user
        puts @response
        assert_redirected_to hosts_url
        assert_includes flash[:notice] || flash[:success], 'Created Snapshot for 1 host'
      end

      test 'create valid multiple without specific mode' do
        post :create_multiple_host, params: { :host_ids => [host.id, host2.id], :snapshot => { :name => 'test' } }, session: set_session_user
        puts @response
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

      if defined?(TEST_PROXMOX)
        test 'destroy successful' do
          Host::Managed.any_instance.stubs(:vm_exists?).returns(false)
          delete :destroy, params: { :host_id => proxmox_host.to_param, :id => proxmox_snapshot }, session: set_session_user
          assert_redirected_to host_url(proxmox_host, :anchor => 'snapshots')
          assert_includes flash[:notice] || flash[:success], 'Successfully deleted Snapshot.'
        end
      end

      test 'destroy with error' do
        ForemanSnapshotManagement::Snapshot.any_instance.stubs(:destroy).returns(false)
        delete :destroy, params: { :host_id => host.to_param, :id => snapshot_id }, session: set_session_user
        assert_redirected_to host_url(host, :anchor => 'snapshots')
        assert_includes flash[:error], 'Error occurred while removing Snapshot'
      end
    end

    context 'PUT #revert' do
      test 'revert successful VMware' do
        put :revert, params: { :host_id => host.to_param, :id => snapshot_id }, session: set_session_user
        assert_redirected_to host_url(host, :anchor => 'snapshots')
        assert_includes flash[:notice] || flash[:success], 'VM successfully rolled back.'
      end

      if defined?(TEST_PROXMOX)
        test 'revert successful proxmox snapshot' do
          Host::Managed.any_instance.stubs(:vm_exists?).returns(false)
          put :revert, params: { :host_id => proxmox_host.to_param, :id => proxmox_snapshot }, session: set_session_user
          assert_redirected_to host_url(proxmox_host, :anchor => 'snapshots')
          assert_includes flash[:notice] || flash[:success], 'VM successfully rolled back.'
        end
      end

      test 'revert with error' do
        ForemanSnapshotManagement::Snapshot.any_instance.stubs(:revert).returns(false)
        put :revert, params: { :host_id => host.to_param, :id => snapshot_id }, session: set_session_user
        assert_redirected_to host_url(host, :anchor => 'snapshots')
        assert_includes flash[:error], 'Error occurred while rolling back VM'
      end
    end

    context 'PUT #update' do
      test 'update successful VMware snapsoht' do
        data = { 'name' => 'test 2', 'description' => '' }
        put :update, params: { :host_id => host.to_param, :id => snapshot_id, :snapshot => data }, session: set_session_user
        assert_response :success
        body = ActiveSupport::JSON.decode(@response.body)
        assert_equal(data, body)
      end

      if defined?(TEST_PROXMOX)
        test 'update successful proxmox' do
          Host::Managed.any_instance.stubs(:vm_exists?).returns(false)
          data = { 'name' => 'snapshot1', 'description' => 'updated snapshot1' }
          put :update, params: { :host_id => proxmox_host.to_param, :id => proxmox_snapshot, :snapshot => data }, session: set_session_user
          assert_response :success
          body = ActiveSupport::JSON.decode(@response.body)
          assert_equal(data, body)
        end
      end

      test 'update with error VMware snapshot' do
        ForemanSnapshotManagement::Snapshot.any_instance.stubs(:save).returns(false)
        put :update, params: { :host_id => host.to_param, :id => snapshot_id, :snapshot => { :name => 'test 2' } }, session: set_session_user
        assert_response :unprocessable_entity
      end

      if defined?(TEST_PROXMOX)
        test 'update with error proxmox snapshot' do
          Host::Managed.any_instance.stubs(:vm_exists?).returns(false)
          ForemanSnapshotManagement::Snapshot.any_instance.stubs(:save).returns(false)
          put :update, params: { :host_id => proxmox_host.to_param, :id => proxmox_snapshot, :snapshot => { :name => 'snapshot1', :description => 'fail' } }, session: set_session_user
          assert_response :unprocessable_entity
        end
      end
    end
  end
end
