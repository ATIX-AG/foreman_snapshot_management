object @snapshot

extends 'api/v2/snapshots/base'

attributes :description

node(:created_at, &:create_time)
node(:parent_id) { |snapshot| snapshot.parent.try(:id) }
node(:children_ids) { |snapshot| snapshot.children.map(&:id) }
