# frozen_string_literal: true

module FogExtensions
  module Proxmox
    module Snapshots
      module Mock
        def status_task(_node, _upid)
          {
            'type' => 'qmsnapshot',
            'starttime' => 1_580_720_848,
            'pstart' => 1_864_464_143,
            'node' => 'proxmox',
            'upid' => 'UPID:proxmox:00003E13:6F21770F:5E37E2D0:qmsnapshot:100:root@pam:',
            'user' => 'root@pam',
            'exitstatus' => 'OK',
            'status' => 'stopped',
            'id' => '100',
            'pid' => 15_891,
          }
        end
      end
    end
  end
end
