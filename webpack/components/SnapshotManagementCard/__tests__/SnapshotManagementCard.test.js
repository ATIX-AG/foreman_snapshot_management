import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import SnapshotManagementCard from '../SnapshotManagementCard';

const hostDetails = {
  id: 42,
  name: 'deep.thought',
  uuid: '829aa26a-928f-11ee-b9d1-0242ac120002',
  permissions: {
    create_snapshots: true,
    edit_snapshots: false,
    revert_snapshots: true,
    destroy_snapshots: false,
  },
};

const hostDetailsVmware = {
  ...hostDetails,
  capabilities: [
    'build',
    'image',
    'snapshots',
    'snapshot_include_quiesce',
    'snapshot_include_ram',
    'editable_snapshot_name',
  ],
};
const hostDetailsProxmox = {
  ...hostDetails,
  capabilities: [
    'build',
    'new_volume',
    'new_interface',
    'image',
    'snapshots',
    'limit_snapshot_name_format',
  ],
};

const fixtures = {
  'without optional Props': {},
  'with Props': { hostDetails },
  'with VMWare capabilities': {
    hostDetails: hostDetailsVmware,
  },
  'with Proxmox capabilities': {
    hostDetails: hostDetailsProxmox,
  },
};

describe('SnapshotManagementCard', () => {
  describe('renders', () =>
    testComponentSnapshotsWithFixtures(SnapshotManagementCard, fixtures));
});
