# frozen_string_literal: true

require 'test_plugin_helper'

class Api::V2::SnapshotsControllerTest < ActionController::TestCase
  let(:tax_location) { Location.find_by(name: 'Location 1') }
  let(:tax_organization) { Organization.find_by(name: 'Organization 1') }
  let(:compute_resource) do
    cr = FactoryBot.create(:compute_resource, :vmware, :uuid => 'Solutions', :locations => [tax_location], organizations: [tax_organization])
    ComputeResource.find_by(id: cr.id)
  end
  let(:uuid) { '5032c8a5-9c5e-ba7a-3804-832a03e16381' }
  let(:host) { FactoryBot.create(:host, :managed, :compute_resource => compute_resource, :uuid => uuid) }
  let(:snapshot_id) { 'snapshot-0101' }

  if defined?(TEST_PROXMOX)
    let(:vmid) { '100' }
    let(:proxmox_compute_resource) do
      cr = FactoryBot.create(:proxmox_cr)
      ComputeResource.find_by(id: cr.id)
    end
    let(:proxmox_host) { FactoryBot.create(:host, :managed, :compute_resource => proxmox_compute_resource, :uuid => "1_#{vmid}") }
    let(:proxmox_snapshot) { 'snapshot1' }
  end

  let(:manager_user) do
    roles = [Role.find_by(name: 'Snapshot Manager')]
    FactoryBot.create(:user, :organizations => [tax_organization], :locations => [tax_location], :roles => roles)
  end
  let(:view_user) do
    roles = [Role.find_by(name: 'Snapshot Viewer')]
    FactoryBot.create(:user, :organizations => [tax_organization], :locations => [tax_location], :roles => roles)
  end
  setup { ::Fog.mock! }
  teardown { ::Fog.unmock! }

  context 'view user' do
    setup do
      # Make sure that test-hosts are created here (by the admin-user)
      host
      proxmox_host if defined?(TEST_PROXMOX)
      @orig_user = User.current
      User.current = view_user
    end
    teardown do
      User.current = @orig_user
    end

    test 'should get index of Vmware Snapshots' do
      get :index, params: { :host_id => host.to_param }
      assert_response :success
      assert_not_nil assigns(:snapshots)
      body = ActiveSupport::JSON.decode(@response.body)
      assert_not_empty body
      assert_not_empty body['results']
    end

    if defined?(TEST_PROXMOX)
      test 'should get index of Proxmox Snapshots' do
        Host::Managed.any_instance.stubs(:vm_exists?).returns(false)
        get :index, params: { :host_id => proxmox_host.to_param }
        assert_response :success
        assert_not_nil assigns(:snapshots)
        body = ActiveSupport::JSON.decode(@response.body)
        assert_not_empty body
        assert_not_empty body['results']
      end
    end

    test 'should search VMware snapshot' do
      get :index, params: { :host_id => host.to_param, :search => 'name= clean' }
      assert_response :success
      assert_not_nil assigns(:snapshots)
      body = ActiveSupport::JSON.decode(@response.body)
      assert_not_empty body
      assert_not_empty body['results']
      assert_equal body['results'].count, 1
    end

    if defined?(TEST_PROXMOX)
      test 'should search Proxmox snapshot' do
        Host::Managed.any_instance.stubs(:vm_exists?).returns(false)
        get :index, params: { :host_id => proxmox_host.to_param, :search => 'name= snapshot1' }
        assert_response :success
        assert_not_nil assigns(:snapshots)
        body = ActiveSupport::JSON.decode(@response.body)
        assert_not_empty body
        assert_not_empty body['results']
        assert_equal body['results'].count, 1
      end
    end

    test 'should refute search Vmware snapshot' do
      get :index, params: { :host_id => host.to_param, :search => 'name != clean' }
      assert_response :internal_server_error
    end

    test 'should show Vmware snapshot' do
      get :show, params: { :host_id => host.to_param, :id => snapshot_id }
      assert_not_nil assigns(:snapshot)
      assert_response :success
      body = ActiveSupport::JSON.decode(@response.body)
      assert_not_empty body
    end

    if defined?(TEST_PROXMOX)
      test 'should show Proxmox snapshot' do
        Host::Managed.any_instance.stubs(:vm_exists?).returns(false)
        get :show, params: { :host_id => proxmox_host.to_param, :id => proxmox_snapshot }
        assert_not_nil assigns(:snapshot)
        assert_response :success
        body = ActiveSupport::JSON.decode(@response.body)
        assert_not_empty body
      end
    end

    test 'should 404 for unknown Vmware snapshot' do
      get :show, params: { :host_id => host.to_param, :id => 'does-not-exist' }
      assert_response :not_found
    end

    test 'should refute create Vmware snapshot' do
      post :create, params: { :host_id => host.to_param, :name => 'test' }
      assert_response :forbidden
    end

    test 'should refute update Vmware snapshot' do
      name = 'test'
      put :update, params: { :host_id => host.to_param, :id => snapshot_id.to_param, :name => name.to_param }
      assert_response :forbidden
    end

    test 'should refute destroy Vmware snapshot' do
      delete :destroy, params: { :host_id => host.to_param, :id => snapshot_id.to_param }
      assert_response :forbidden
    end

    if defined?(TEST_PROXMOX)
      test 'should refute revert Proxmox snapshot' do
        Host::Managed.any_instance.stubs(:vm_exists?).returns(false)
        put :revert, params: { :host_id => proxmox_host.to_param, :id => proxmox_snapshot.to_param }
        assert_response :forbidden
      end
    end
  end

  context 'manager user' do
    setup do
      # Make sure that test-hosts are created here (by the admin-user)
      host
      proxmox_host if defined?(TEST_PROXMOX)
      @orig_user = User.current
      User.current = manager_user
    end
    teardown do
      User.current = @orig_user
    end

    test 'should get index of Vmware Snapshots' do
      get :index, params: { :host_id => host.to_param }
      assert_response :success
      assert_not_nil assigns(:snapshots)
      body = ActiveSupport::JSON.decode(@response.body)
      assert_not_empty body
      assert_not_empty body['results']
    end

    if defined?(TEST_PROXMOX)
      test 'should get index of Proxmox Snapshots' do
        Host::Managed.any_instance.stubs(:vm_exists?).returns(false)
        get :index, params: { :host_id => proxmox_host.to_param }
        assert_response :success
        assert_not_nil assigns(:snapshots)
        body = ActiveSupport::JSON.decode(@response.body)
        assert_not_empty body
        assert_not_empty body['results']
      end
    end

    test 'should search VMware snapshot' do
      get :index, params: { :host_id => host.to_param, :search => 'name= clean' }
      assert_response :success
      assert_not_nil assigns(:snapshots)
      body = ActiveSupport::JSON.decode(@response.body)
      assert_not_empty body
      assert_not_empty body['results']
      assert_equal body['results'].count, 1
    end

    if defined?(TEST_PROXMOX)
      test 'should search Proxmox snapshot' do
        Host::Managed.any_instance.stubs(:vm_exists?).returns(false)
        get :index, params: { :host_id => proxmox_host.to_param, :search => 'name= snapshot1' }
        assert_response :success
        assert_not_nil assigns(:snapshots)
        body = ActiveSupport::JSON.decode(@response.body)
        assert_not_empty body
        assert_not_empty body['results']
        assert_equal body['results'].count, 1
      end
    end

    test 'should refute search Vmware snapshot' do
      get :index, params: { :host_id => host.to_param, :search => 'name != clean' }
      assert_response :internal_server_error
    end

    test 'should show Vmware snapshot' do
      get :show, params: { :host_id => host.to_param, :id => snapshot_id }
      assert_not_nil assigns(:snapshot)
      assert_response :success
      body = ActiveSupport::JSON.decode(@response.body)
      assert_not_empty body
    end

    if defined?(TEST_PROXMOX)
      test 'should show Proxmox snapshot' do
        Host::Managed.any_instance.stubs(:vm_exists?).returns(false)
        get :show, params: { :host_id => proxmox_host.to_param, :id => proxmox_snapshot }
        assert_not_nil assigns(:snapshot)
        assert_response :success
        body = ActiveSupport::JSON.decode(@response.body)
        assert_not_empty body
      end
    end

    test 'should 404 for unknown Vmware snapshot' do
      get :show, params: { :host_id => host.to_param, :id => 'does-not-exist' }
      assert_response :not_found
    end

    test 'should create Vmware snapshot' do
      post :create, params: { :host_id => host.to_param, :name => 'test' }
      assert_response :created
      assert_not_nil assigns(:snapshot)
    end

    if defined?(TEST_PROXMOX)
      test 'should create Proxmox snapshot' do
        Host::Managed.any_instance.stubs(:vm_exists?).returns(false)
        post :create, params: { :host_id => proxmox_host.to_param, :name => 'test' }
        assert_response :created
        assert_not_nil assigns(:snapshot)
      end
    end

    test 'should update Vmware snapshot' do
      name = 'test'
      put :update, params: { :host_id => host.to_param, :id => snapshot_id.to_param, :name => name.to_param }
      assert_response :success
    end

    if defined?(TEST_PROXMOX)
      test 'should update Proxmox snapshot' do
        Host::Managed.any_instance.stubs(:vm_exists?).returns(false)
        description = 'snapshot1 updated'
        put :update, params: { :host_id => proxmox_host.to_param, :id => proxmox_snapshot.to_param, :description => description.to_param }
        assert_response :success
      end

      test 'should refute update Proxmox snapshot name' do
        Host::Managed.any_instance.stubs(:vm_exists?).returns(false)
        name = 'test'
        put :update, params: { :host_id => proxmox_host.to_param, :id => proxmox_snapshot.to_param, :name => name.to_param }
        assert_response :unprocessable_entity
      end
    end

    test 'should destroy Vmware snapshot' do
      delete :destroy, params: { :host_id => host.to_param, :id => snapshot_id.to_param }
      assert_response :success
    end

    test 'should revert Vmware snapshot' do
      put :revert, params: { :host_id => host.to_param, :id => snapshot_id.to_param }
      assert_response :success
    end

    if defined?(TEST_PROXMOX)
      test 'should destroy Proxmox snapshot' do
        Host::Managed.any_instance.stubs(:vm_exists?).returns(false)
        delete :destroy, params: { :host_id => proxmox_host.to_param, :id => proxmox_snapshot.to_param }
        assert_response :success
        body = ActiveSupport::JSON.decode(@response.body)
        assert_not_nil body['name']
        assert_nil body['id']
      end

      test 'should revert Proxmox snapshot' do
        Host::Managed.any_instance.stubs(:vm_exists?).returns(false)
        put :revert, params: { :host_id => proxmox_host.to_param, :id => proxmox_snapshot.to_param }
        assert_response :success
      end
    end
  end
end
