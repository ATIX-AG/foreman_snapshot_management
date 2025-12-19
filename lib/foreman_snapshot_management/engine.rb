# frozen_string_literal: true

module ForemanSnapshotManagement
  class Engine < ::Rails::Engine
    engine_name 'foreman_snapshot_management'

    initializer 'foreman_snapshot_management.register_plugin', before: :finisher_hook do |app|
      app.reloader.to_prepare do
        Foreman::Plugin.register :foreman_snapshot_management do
          requires_foreman '>= 3.13'
          register_gettext

          # Add Global files for extending foreman-core components and routes
          register_global_js_file 'global'

          apipie_documented_controllers ["#{ForemanSnapshotManagement::Engine.root}/app/controllers/api/v2/*.rb"]

          # Add permissions
          security_block :foreman_snapshot_management do
            permission :view_snapshots, {
              :'foreman_snapshot_management/snapshots' => [:index],
              :'api/v2/snapshots' => [:index, :show],
            }, :resource_type => 'Host'

            permission :create_snapshots, {
              :'foreman_snapshot_management/snapshots' => [:create, :select_multiple_host, :create_multiple_host],
              :'api/v2/snapshots' => [:create],
              :'api/v2/bulk_snapshots' => [:create],
            }, :resource_type => 'Host'

            permission :edit_snapshots, {
              :'foreman_snapshot_management/snapshots' => [:update],
              :'api/v2/snapshots' => [:update],
            }, :resource_type => 'Host'

            permission :destroy_snapshots, {
              :'foreman_snapshot_management/snapshots' => [:destroy],
              :'api/v2/snapshots' => [:destroy],
            }, :resource_type => 'Host'

            permission :revert_snapshots, {
              :'foreman_snapshot_management/snapshots' => [:revert],
              :'api/v2/snapshots' => [:revert],
            }, :resource_type => 'Host'
          end

          # Adds roles if they do not exist
          role 'Snapshot Viewer',
            [:view_snapshots],
            'Role granting permission only to view snapshots for hosts'
          role 'Snapshot Manager',
            [
              :view_snapshots,
              :create_snapshots,
              :edit_snapshots,
              :destroy_snapshots,
              :revert_snapshots,
            ],
            'Role granting permission to manage snapshots for hosts'

          extend_page('hosts/show') do |context|
            context.add_pagelet :main_tabs,
              :name => N_('Snapshots'),
              :partial => 'hosts/snapshots_tab',
              :onlyif => proc { |host| host&.uuid.present? && host&.compute_resource&.capable?(:snapshots) }
          end

          describe_host do
            multiple_actions_provider :snapshot_multiple_actions
          end
        end
      end
    end

    # Precompile any JS or CSS files under app/assets/
    # If requiring files from each other, list them explicitly here to avoid precompiling the same
    # content twice.
    assets_to_precompile =
      Dir.chdir(root) do
        Dir['app/assets/javascripts/**/*', 'app/assets/stylesheets/**/*'].map do |f|
          f.split(File::SEPARATOR, 4).last
        end
      end
    initializer 'foreman_snapshot_management.assets.precompile' do |app|
      app.config.assets.precompile += assets_to_precompile
    end
    initializer 'foreman_snapshot_management.configure_assets', group: :assets do
      SETTINGS[:foreman_snapshot_management] = { assets: { precompile: assets_to_precompile } }
    end

    # Include concerns in this config.to_prepare block
    config.to_prepare do
      begin
        ::ForemanFogProxmox::Proxmox.prepend ForemanSnapshotManagement::ProxmoxExtensions

        # Load Fog extensions
        Fog::Proxmox::Compute::Mock.prepend FogExtensions::Proxmox::Snapshots::Mock if ForemanFogProxmox::Proxmox.available?
      rescue StandardError => e
        Rails.logger.warn "Failed to load Proxmox extension #{e}"
      end

      begin
        ::Foreman::Model::Vmware.prepend ForemanSnapshotManagement::VmwareExtensions

        # Load Fog extensions
        if Foreman::Model::Vmware.available?
          ForemanSnapshotManagement.fog_vsphere_namespace::Real.prepend FogExtensions::Vsphere::Snapshots::Real
          ForemanSnapshotManagement.fog_vsphere_namespace::Mock.prepend FogExtensions::Vsphere::Snapshots::Mock
        end
      rescue StandardError => e
        Rails.logger.warn "Failed to load VMware extension #{e}"
      end
    rescue StandardError => e
      Rails.logger.warn "ForemanSnapshotManagement: skipping engine hook (#{e})"
    end

    rake_tasks do
      Rake::Task['db:seed'].enhance do
        ForemanSnapshotManagement::Engine.load_seed
      end
    end
  end

  def self.fog_vsphere_namespace
    @fog_vsphere_namespace ||= calculate_fog_vsphere_namespace
  end

  def self.calculate_fog_vsphere_namespace
    require 'fog/vsphere/version'
    if Gem::Version.new(Fog::Vsphere::VERSION) >= Gem::Version.new('3.0.0')
      Fog::Vsphere::Compute
    else
      Fog::Compute::Vsphere
    end
  end
end
