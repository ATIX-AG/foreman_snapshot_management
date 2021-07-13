# frozen_string_literal: true

module Foreman::Controller::Parameters::Snapshot
  extend ActiveSupport::Concern

  class_methods do
    def snapshot_params_filter
      Foreman::ParameterFilter.new(::ForemanSnapshotManagement::Snapshot).tap do |filter|
        filter.permit :name, :description, :include_ram, :host_id
      end
    end
  end

  def snapshot_params
    self.class.snapshot_params_filter.filter_params(params, parameter_filter_context)
  end
end
