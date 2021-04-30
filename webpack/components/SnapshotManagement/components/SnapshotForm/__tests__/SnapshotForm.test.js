import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import SnapshotForm from '../SnapshotForm';

const fixtures = {
  'render without optional Props': { hostId: 42, submitForm: () => null },
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
