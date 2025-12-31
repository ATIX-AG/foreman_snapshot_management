import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import SnapshotForm from '../SnapshotForm';

const fetchBulkParams = () => null;

const fixtures = {
  render: { hostId: 42, onSubmit: () => null, fetchBulkParams },
  'render with limitSnapshotNameFormat capability': {
    hostId: 42,
    onSubmit: () => null,
    fetchBulkParams,
    capabilities: { limitSnapshotNameFormat: true },
  },
  'render with optional Props': {
    hostId: 42,
    onSubmit: () => null,
    fetchBulkParams,
    initialValues: {
      name: 'Snapshot1',
      description: 'Hello World',
      includeRam: true,
    },
  },
};

describe('SnapshotForm', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(SnapshotForm, fixtures));
});
