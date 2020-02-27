# frozen_string_literal: true

# This calls the main test_helper in Foreman-core
require 'test_helper'

FactoryBot.definition_file_paths << File.join(File.dirname(__FILE__), 'factories')
FactoryBot.reload
