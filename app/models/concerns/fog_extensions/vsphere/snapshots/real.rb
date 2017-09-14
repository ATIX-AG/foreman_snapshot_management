module FogExtensions
  module Vsphere
    module Snapshots
      module Real
        # Extends fog-vsphere gem for a remove Snapshot method.
        def remove_snapshot(options = {})
          raise ArgumentError, 'snapshot is a required parameter' unless options.key? 'snapshot'
          raise ArgumentError, 'removeChildren is a required parameter' unless options.key? 'removeChildren'

          unless ::Fog::Compute::Vsphere::Snapshot === options['snapshot']
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
        # Does not have a return value, VMWare API throws a fault if there are errors
        def rename_snapshot(options = {})
          raise ArgumentError, 'snapshot is a required parameter' unless options.key? 'snapshot'
          raise ArgumentError, 'name is a required parameter' unless options.key? 'name'
          raise ArgumentError, 'description is a required parameter' unless options.key? 'description'

          unless ::Fog::Compute::Vsphere::Snapshot === options['snapshot']
            raise ArgumentError, 'snapshot is a required parameter'
          end

          options['snapshot'].mo_ref.RenameSnapshot(
            name: options['name'],
            description: options['description']
          )
        end
      end
    end
  end
end
