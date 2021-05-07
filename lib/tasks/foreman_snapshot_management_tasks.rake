# frozen_string_literal: true

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

begin
  require 'rubocop/rake_task'

  test_patterns = ["#{ForemanSnapshotManagement::Engine.root}/app/**/*.rb",
                   "#{ForemanSnapshotManagement::Engine.root}/lib/**/*.rb",
                   "#{ForemanSnapshotManagement::Engine.root}/test/**/*.rb"]

  namespace :foreman_snapshot_management do
    task rubocop: :environment do
      RuboCop::RakeTask.new(:rubocop_foreman_snapshot_management) do |task|
        task.patterns = test_patterns
      end

      Rake::Task['rubocop_foreman_snapshot_management'].invoke
    end

    desc 'Runs Rubocop style checker with xml output for Jenkins'
    RuboCop::RakeTask.new('rubocop:jenkins') do |task|
      task.patterns = test_patterns
      task.requires = ['rubocop/formatter/checkstyle_formatter']
      task.formatters = ['RuboCop::Formatter::CheckstyleFormatter']
      task.options = ['--no-color', '--out', 'rubocop.xml']
    end
  end
rescue LoadError
  puts 'Rubocop not loaded.'
end

namespace :jenkins do
  desc 'Test ForemanSnapshotManagement with XML output for jenkins'
  task 'foreman_snapshot_management' => :environment do
    Rake::Task['jenkins:setup:minitest'].invoke
    Rake::Task['rake:test:foreman_snapshot_management'].invoke
  end
end

Rake::Task[:test].enhance ['test:foreman_snapshot_management']

load 'tasks/jenkins.rake'
Rake::Task['jenkins:unit'].enhance ['test:foreman_snapshot_management', 'foreman_snapshot_management:rubocop'] if Rake::Task.task_defined?(:'jenkins:unit')
