module FogExtensions
  module Vsphere
    module Snapshots
      module Mock
        # Overwrite this to stop infinite recursion
        # TODO: Add proper test data
        def list_child_snapshots(_snapshot, _opts = {})
          []
        end

        def remove_snapshot(options = {})
          raise ArgumentError, 'snapshot is a required parameter' unless options.key? 'snapshot'
          raise ArgumentError, 'removeChildren is a required parameter' unless options.key? 'removeChildren'

          {
            'task_state' => 'success'
          }
        end

        def rename_snapshot(options = {})
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
