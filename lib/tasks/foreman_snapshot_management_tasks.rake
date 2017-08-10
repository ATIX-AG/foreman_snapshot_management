# Tests
namespace :test do
  desc 'Test ForemanSnapshotManagement'
  Rake::TestTask.new(:foreman_snapshot_management) do |t|
    test_dir = File.join(File.dirname(__FILE__), '../..', 'test')
    t.libs << ['test', test_dir]
    t.pattern = "#{test_dir}/**/*_test.rb"
    t.verbose = true
    t.warning = false
  end
end

namespace :foreman_snapshot_management do
  task :rubocop do
    begin
      require 'rubocop/rake_task'
      RuboCop::RakeTask.new(:rubocop_foreman_snapshot_management) do |task|
        task.patterns = ["#{ForemanSnapshotManagement::Engine.root}/app/**/*.rb",
                         "#{ForemanSnapshotManagement::Engine.root}/lib/**/*.rb",
                         "#{ForemanSnapshotManagement::Engine.root}/test/**/*.rb"]
      end
    rescue
      puts 'Rubocop not loaded.'
    end

    Rake::Task['rubocop_foreman_snapshot_management'].invoke
  end
end

Rake::Task[:test].enhance ['test:foreman_snapshot_management']

load 'tasks/jenkins.rake'
if Rake::Task.task_defined?(:'jenkins:unit')
  Rake::Task['jenkins:unit'].enhance ['test:foreman_snapshot_management', 'foreman_snapshot_management:rubocop']
end
