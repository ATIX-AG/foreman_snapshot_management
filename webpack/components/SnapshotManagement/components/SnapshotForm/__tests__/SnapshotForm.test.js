import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import SnapshotForm from '../SnapshotForm';

const fixtures = {
  render: { hostId: 42, submitForm: () => null },
  'render with limitSnapshotNameFormat capability': {
    hostId: 42,
    submitForm: () => null,
    capabilities: { limitSnapshotNameFormat: true },
  },
  'render with optional Props': {
    hostId: 42,
    submitForm: () => null,
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
