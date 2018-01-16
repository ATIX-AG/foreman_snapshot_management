require File.expand_path('../lib/foreman_snapshot_management/version', __FILE__)
require 'date'

Gem::Specification.new do |s|
  s.name        = 'foreman_snapshot_management'
  s.version     = ForemanSnapshotManagement::VERSION
  s.date        = Date.today.to_s
  s.authors     = ['ATIX AG']
  s.email       = ['info@atix.de']
  s.homepage    = 'http://www.orcharhino.com'
  s.summary     = 'Snapshot Management for VMware vSphere'
  # also update locale/gemspec.rb
  s.description = 'Foreman-plugin to manage snapshots in a vSphere environment.'

  s.files = Dir['{app,config,db,lib,locale}/**/*'] + ['LICENSE', 'Rakefile', 'README.md']
  s.test_files = Dir['test/**/*']

  s.add_dependency 'deface'
  s.add_development_dependency 'rdoc'
  s.add_development_dependency 'rubocop', '0.49.1'
end
