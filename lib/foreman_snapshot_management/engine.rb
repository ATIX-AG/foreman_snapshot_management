require 'deface'

module ForemanSnapshotManagement
  class Engine < ::Rails::Engine
    engine_name 'foreman_snapshot_management'

    config.autoload_paths += Dir["#{config.root}/app/controllers/foreman_snapshot_management/"]
    config.autoload_paths += Dir["#{config.root}/app/helpers/foreman_snapshot_management/"]
    config.autoload_paths += Dir["#{config.root}/app/models/foreman_snapshot_management"]
    config.autoload_paths += Dir["#{config.root}/app/overrides"]

    # Add any db migrations
    initializer 'foreman_snapshot_management.load_app_instance_data' do |app|
      ForemanSnapshotManagement::Engine.paths['db/migrate'].existent.each do |path|
        app.config.paths['db/migrate'] << path
      end
    end

    initializer 'foreman_snapshot_management.register_plugin', :before => :finisher_hook do |_app|
      Foreman::Plugin.register :foreman_snapshot_management do
        requires_foreman '>= 1.14'

        # Add permissions
        security_block :foreman_snapshot_management do
          permission :view_foreman_snapshot_management, :'foreman_snapshot_management/hosts' => [:new_action]
          permission :view_foreman_snapshot_management, :'foreman_snapshot_management/virtualmachines' => [:index]
          permission :view_foreman_snapshot_management, :'foreman_snapshot_management/createsnapshot' => [:index]
          permission :view_foreman_snapshot_management, :'foreman_snapshot_management/createsnapshot' => [:createSnapshot]
        end

        # Add a new role called 'Discovery' if it doesn't exist
        role 'ForemanSnapshotManagement', [:view_foreman_snapshot_management]
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
        ::Foreman::Model::Vmware.send(:include, ForemanSnapshotManagement::VmwareExtensions)
      rescue => e
        Rails.logger.warn "ForemanSnapshotManagement: skipping engine hook (#{e})"
      end
    end

    rake_tasks do
      Rake::Task['db:seed'].enhance do
        ForemanSnapshotManagement::Engine.load_seed
      end
    end

    initializer 'foreman_snapshot_management.register_gettext', after: :load_config_initializers do |_app|
      locale_dir = File.join(File.expand_path('../../..', __FILE__), 'locale')
      locale_domain = 'foreman_snapshot_management'
      Foreman::Gettext::Support.add_text_domain locale_domain, locale_dir
    end
  end
end
