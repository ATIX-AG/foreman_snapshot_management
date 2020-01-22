# frozen_string_literal: true

require 'test_helper'

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
  setup { ::Fog.mock! }
  teardown { ::Fog.unmock! }

  test 'should get index' do
    get :index, params: { :host_id => host.to_param }
    assert_response :success
    assert_not_nil assigns(:snapshots)
    body = ActiveSupport::JSON.decode(@response.body)
    assert_not_empty body
    assert_not_empty body['results']
  end

  test 'should search snapshot' do
    get :index, params: { :host_id => host.to_param, :search => 'name= clean' }
    assert_response :success
    assert_not_nil assigns(:snapshots)
    body = ActiveSupport::JSON.decode(@response.body)
    assert_not_empty body
    assert_not_empty body['results']
    assert body['results'].count == 1
  end

  test 'should refute search snapshot' do
    get :index, params: { :host_id => host.to_param, :search => 'name != clean' }
    assert_response :internal_server_error
  end

  test 'should show snapshot' do
    get :show, params: { :host_id => host.to_param, :id => snapshot_id }
    assert_not_nil assigns(:snapshot)
    assert_response :success
    body = ActiveSupport::JSON.decode(@response.body)
    assert_not_empty body
  end

  test 'should 404 for unknown snapshot' do
    get :show, params: { :host_id => host.to_param, :id => 'does-not-exist' }
    assert_response :not_found
  end

  test 'should create snapshot' do
    post :create, params: { :host_id => host.to_param, :name => 'test' }
    assert_response :created
    assert_not_nil assigns(:snapshot)
  end

  test 'should update snapshot' do
    name = 'test'
    put :update, params: { :host_id => host.to_param, :id => snapshot_id.to_param, :name => name.to_param }
    assert_response :success
  end

  test 'should destroy snapshot' do
    delete :destroy, params: { :host_id => host.to_param, :id => snapshot_id.to_param }
    assert_response :success
  end

  test 'should revert snapshot' do
    put :revert, params: { :host_id => host.to_param, :id => snapshot_id.to_param }
    assert_response :success
  end
end
