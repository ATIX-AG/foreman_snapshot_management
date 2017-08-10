module ForemanSnapshotManagement
  module SnapshotadministrationHelper
  end
end

module Fog
  module Compute
    class Vsphere
      class Real
        # Extends fog-vsphere gem for a remove Snapshot method.
        def remove_snapshot(options = {})
          raise ArgumentError, 'snapshot is a required parameter' unless options.key? 'snapshot'
          raise ArgumentError, 'removeChildren is a required parameter' unless options.key? 'removeChildren'

          unless Snapshot === options['snapshot']
            raise ArgumentError, 'snapshot is a required parameter'
          end

          task = options['snapshot'].mo_ref.RemoveSnapshot_Task(
            removeChildren: options['removeChildren']
          )
          task.wait_for_completion

          {
            'task_state' => task.info.state
          }
        end

        # Extends fog-vsphere gem for a rename Snapshot method.
        # TODO: Add info state
        def rename_snapshot(options = {})
          raise ArgumentError, 'snapshot is a required parameter' unless options.key? 'snapshot'
          raise ArgumentError, 'name is a required parameter' unless options.key? 'name'
          raise ArgumentError, 'description is a required parameter' unless options.key? 'description'

          unless Snapshot === options['snapshot']
            raise ArgumentError, 'snapshot is a required parameter'
          end

          task = options['snapshot'].mo_ref.RenameSnapshot(
            name: options['name'],
            description: options['description']
          )
          # task.wait_for_completion

          # {
          #    'task_state' => task.info.state
          # }
        end
      end
      class Mock
        def remove_snapshot(snapshot)
          raise ArgumentError, 'snapshot is a required parameter' unless options.key? 'snapshot'
          raise ArgumentError, 'removeChildren is a required parameter' unless options.key? 'removeChildren'
          raise ArgumentError, 'snapshot is a required parameter' if snapshot.nil?
          {
            'task_state' => 'success'
          }
        end

        def rename_snapshot(_snapshot)
          raise ArgumentError, 'snapshot is a required parameter' unless options.key? 'snapshot'
          raise ArgumentError, 'name is a required parameter' unless options.key? 'name'
          raise ArgumentError, 'description is a required parameter' unless options.key? 'description'
          {
            'task_state' => 'success'
          }
        end
      end
    end
  end
end
