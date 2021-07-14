# frozen_string_literal: true

object @snapshot

extends 'api/v2/snapshots/base'

attributes :description, :include_ram

node(:created_at, &:create_time)
node(:parent_id) { |snapshot| snapshot.try(:parent).try(:id) }
node(:children_ids) { |snapshot| snapshot.try(:children).try(:map, &:id) }
