# frozen_string_literal: true

require 'test_plugin_helper'

class Api::V2::BulkSnapshotsControllerTest < ActionController::TestCase
  let(:tax_location) { Location.find_by(name: 'Location 1') }
  let(:tax_organization) { Organization.find_by(name: 'Organization 1') }

  let(:compute_resource) do
    cr = FactoryBot.create(
      :compute_resource,
      :vmware,
      :uuid => 'Solutions',
      :locations => [tax_location],
      :organizations => [tax_organization]
    )
    ComputeResource.find_by(id: cr.id)
  end

  let(:uuid1) { '5032c8a5-9c5e-ba7a-3804-832a03e16381' }
  let(:uuid2) { '502916a3-b42e-17c7-43ce-b3206e9524dc' }

  let(:host1) do
    FactoryBot.create(:host, :managed, :compute_resource => compute_resource, :uuid => uuid1)
  end

  let(:host2) do
    FactoryBot.create(:host, :managed, :compute_resource => compute_resource, :uuid => uuid2)
  end

  let(:host_without_compute) do
    FactoryBot.create(:host, :managed, :compute_resource => nil)
  end

  let(:manager_user) do
    roles = [Role.find_by(name: 'Snapshot Manager')]
    FactoryBot.create(
      :user,
      :organizations => [tax_organization],
      :locations => [tax_location],
      :roles => roles
    )
  end

  let(:view_user) do
    roles = [Role.find_by(name: 'Snapshot Viewer')]
    FactoryBot.create(
      :user,
      :organizations => [tax_organization],
      :locations => [tax_location],
      :roles => roles
    )
  end

  setup { ::Fog.mock! }
  teardown { ::Fog.unmock! }

  def bulk_params(ids:)
    {
      :organization_id => tax_organization.id,
      :included => { :ids => ids },
      :excluded => { :ids => [] },
    }
  end

  context 'user without edit_hosts permissions (bulk selection gate)' do
    setup do
      host1
      host2
      @orig_user = User.current
      User.current = view_user
    end

    teardown do
      User.current = @orig_user
    end

    test 'should forbid bulk snapshot create when user cannot bulk-select hosts' do
      post :create, params: bulk_params(ids: [host1.id, host2.id]).merge(
        :snapshot => { :name => 'test' }
      )
      assert_response :forbidden
    end
  end

  context 'manager user with valid permissions' do
    setup do
      host1
      host2
      host_without_compute
      @orig_user = User.current
      User.current = manager_user

      ForemanSnapshotManagement::Snapshot.any_instance.stubs(:create).returns(true)
    end

    teardown do
      User.current = @orig_user
    end

    test 'should return 422 when snapshot parameter is missing' do
      post :create, params: bulk_params(ids: [host1.id, host2.id])
      assert_response :unprocessable_entity
      body = ActiveSupport::JSON.decode(@response.body)
      assert_includes body['error'], 'snapshot.name is required'
    end

    test 'should return 422 when snapshot name is missing' do
      post :create, params: bulk_params(ids: [host1.id, host2.id]).merge(
        :snapshot => { :description => 'test description' }
      )
      assert_response :unprocessable_entity
      body = ActiveSupport::JSON.decode(@response.body)
      assert_includes body['error'], 'snapshot.name is required'
    end

    test 'should return 422 when snapshot name is empty string' do
      post :create, params: bulk_params(ids: [host1.id, host2.id]).merge(
        :snapshot => { :name => '' }
      )
      assert_response :unprocessable_entity
      body = ActiveSupport::JSON.decode(@response.body)
      assert_includes body['error'], 'snapshot.name is required'
    end

    test 'should return 422 when snapshot name is only whitespace' do
      post :create, params: bulk_params(ids: [host1.id, host2.id]).merge(
        :snapshot => { :name => '   ' }
      )
      assert_response :unprocessable_entity
      body = ActiveSupport::JSON.decode(@response.body)
      assert_includes body['error'], 'snapshot.name is required'
    end

    test 'should create snapshots with include_ram mode' do
      post :create, params: bulk_params(ids: [host1.id]).merge(
        :snapshot => { :name => 'test_with_ram' },
        :mode => 'include_ram'
      )
      assert_response :ok
      body = ActiveSupport::JSON.decode(@response.body)
      assert_equal 1, body['total']
      assert_equal 1, body['success_count']
    end

    test 'should create snapshots with full mode' do
      post :create, params: bulk_params(ids: [host1.id]).merge(
        :snapshot => { :name => 'test_without_ram' },
        :mode => 'full'
      )
      assert_response :ok
      body = ActiveSupport::JSON.decode(@response.body)
      assert_equal 1, body['total']
      assert_equal 1, body['success_count']
    end

    test 'should create snapshots with quiesce mode' do
      post :create, params: bulk_params(ids: [host1.id]).merge(
        :snapshot => { :name => 'test_quiesce' },
        :mode => 'quiesce'
      )
      assert_response :ok
      body = ActiveSupport::JSON.decode(@response.body)
      assert_equal 1, body['total']
      assert_equal 1, body['success_count']
    end

    test 'should return 422 when mode is invalid' do
      post :create, params: bulk_params(ids: [host1.id]).merge(
        :snapshot => { :name => 'invalid_mode_snapshot' },
        :mode => 'invalid_mode'
      )
      assert_response :unprocessable_entity
    end

    test 'should successfully create snapshot for single host' do
      post :create, params: bulk_params(ids: [host1.id]).merge(
        :snapshot => { :name => 'successful_snapshot', :description => 'Test description' }
      )
      assert_response :ok
      body = ActiveSupport::JSON.decode(@response.body)
      assert_equal 1, body['total']
      assert_equal 1, body['success_count']
      assert_equal 0, body['failed_count']
      assert_equal 1, body['results'].length
      assert_equal 'success', body['results'].first['status']
      assert_equal host1.id, body['results'].first['host_id']
      assert_equal host1.name, body['results'].first['host_name']
    end

    test 'should successfully create snapshots for multiple hosts' do
      post :create, params: bulk_params(ids: [host1.id, host2.id]).merge(
        :snapshot => { :name => 'bulk_snapshot', :description => 'Bulk test' }
      )
      assert_response :ok
      body = ActiveSupport::JSON.decode(@response.body)
      assert_equal 2, body['total']
      assert_equal 2, body['success_count']
      assert_equal 0, body['failed_count']
      statuses = body['results'].map { |r| r['status'] }
      assert_equal ['success', 'success'], statuses
    end

    test 'should include snapshot description in request' do
      post :create, params: bulk_params(ids: [host1.id]).merge(
        :snapshot => { :name => 'test', :description => 'Detailed description here' }
      )
      assert_response :ok
      body = ActiveSupport::JSON.decode(@response.body)
      assert_equal 1, body['success_count']
    end

    test 'should handle snapshot without description' do
      post :create, params: bulk_params(ids: [host1.id]).merge(
        :snapshot => { :name => 'test' }
      )
      assert_response :ok
      body = ActiveSupport::JSON.decode(@response.body)
      assert_equal 1, body['success_count']
    end

    test 'should handle snapshot creation failure' do
      ForemanSnapshotManagement::Snapshot.any_instance.stubs(:create).returns(false)
      ForemanSnapshotManagement::Snapshot.any_instance.stubs(:errors).returns(
        OpenStruct.new(full_messages: ['Snapshot creation failed'])
      )

      post :create, params: bulk_params(ids: [host1.id]).merge(
        :snapshot => { :name => 'failing_snapshot' }
      )
      assert_response :unprocessable_entity
      body = ActiveSupport::JSON.decode(@response.body)
      assert_equal 1, body['total']
      assert_equal 0, body['success_count']
      assert_equal 1, body['failed_count']
      assert_equal 'failed', body['results'].first['status']
      assert_equal 1, body['failed_hosts'].length
    end

    test 'should handle exception during snapshot creation' do
      ForemanSnapshotManagement::Snapshot.any_instance.stubs(:create).raises(
        StandardError.new('Unexpected error')
      )

      post :create, params: bulk_params(ids: [host1.id]).merge(
        :snapshot => { :name => 'exception_snapshot' }
      )
      assert_response :unprocessable_entity
      body = ActiveSupport::JSON.decode(@response.body)
      assert_equal 1, body['total']
      assert_equal 0, body['success_count']
      assert_equal 1, body['failed_count']
      assert_equal 'failed', body['results'].first['status']
    end

    test 'should not include error details in results but include in failed_hosts' do
      ForemanSnapshotManagement::Snapshot.any_instance.stubs(:create).returns(false)
      ForemanSnapshotManagement::Snapshot.any_instance.stubs(:errors).returns(
        OpenStruct.new(full_messages: ['Error message'])
      )

      post :create, params: bulk_params(ids: [host1.id]).merge(
        :snapshot => { :name => 'test' }
      )
      body = ActiveSupport::JSON.decode(@response.body)

      assert_nil body['results'].first['errors']
      assert_not_nil body['failed_hosts'].first['errors']
      assert_equal ['Error message'], body['failed_hosts'].first['errors']
    end

    test 'should handle mixed success and failure results' do
      ForemanSnapshotManagement::Snapshot.any_instance.stubs(:create).returns(true, false)
      ForemanSnapshotManagement::Snapshot.any_instance.stubs(:errors).returns(
        OpenStruct.new(full_messages: ['Failed for this host'])
      )

      post :create, params: bulk_params(ids: [host1.id, host2.id]).merge(
        :snapshot => { :name => 'mixed_results' }
      )
      assert_response :unprocessable_entity
      body = ActiveSupport::JSON.decode(@response.body)
      assert_equal 2, body['total']
      assert_equal 1, body['success_count']
      assert_equal 1, body['failed_count']
      assert_equal 1, body['failed_hosts'].length
    end

    test 'should return 422 when any host fails' do
      ForemanSnapshotManagement::Snapshot.any_instance.stubs(:create).returns(false)

      post :create, params: bulk_params(ids: [host1.id, host2.id]).merge(
        :snapshot => { :name => 'test' }
      )
      assert_response :unprocessable_entity
    end

    test 'should return 200 when all hosts succeed' do
      post :create, params: bulk_params(ids: [host1.id, host2.id]).merge(
        :snapshot => { :name => 'test' }
      )
      assert_response :ok
    end

    test 'should handle host without compute resource' do
      post :create, params: bulk_params(ids: [host_without_compute.id]).merge(
        :snapshot => { :name => 'test' }
      )
      assert_response :unprocessable_entity
      body = ActiveSupport::JSON.decode(@response.body)
      assert_equal 1, body['total']
      assert_equal 0, body['success_count']
      assert_equal 1, body['failed_count']
    end

    test 'should handle mix of hosts with and without compute resources' do
      post :create, params: bulk_params(ids: [host1.id, host_without_compute.id]).merge(
        :snapshot => { :name => 'test' }
      )
      assert_response :unprocessable_entity
      body = ActiveSupport::JSON.decode(@response.body)
      assert_equal 2, body['total']
      assert body['failed_count'].positive?
    end

    test 'should return 422 and quiesce error when all hosts fail with quiesce' do
      ForemanSnapshotManagement::Snapshot.any_instance.stubs(:create).returns(false)
      ForemanSnapshotManagement::Snapshot.any_instance.stubs(:errors).returns(
        OpenStruct.new(full_messages: ['Underlying quiesce failure'])
      )

      post :create, params: bulk_params(ids: [host1.id, host2.id]).merge(
        :snapshot => { :name => 'test_quiesce_fail' },
        :mode => 'quiesce'
      )

      assert_response :unprocessable_entity
      body = ActiveSupport::JSON.decode(@response.body)

      assert_equal 2, body['total']
      assert_equal 0, body['success_count']
      assert_equal 2, body['failed_count']
      assert_equal 2, body['failed_hosts'].length

      body['failed_hosts'].each do |failed|
        errors = failed['errors']
        assert_includes errors, 'Underlying quiesce failure'
        assert_includes errors, 'Unable to create VMWare Snapshot with Quiesce. Check Power and VMWare Tools status.'
      end
    end
  end
end
