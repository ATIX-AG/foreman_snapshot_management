import {
  testComponentSnapshotsWithFixtures,
  // shallowRenderComponentWithFixtures,
} from 'react-redux-test-utils';
// import configureStore from 'redux-mock-store';

import SnapshotList from '../SnapshotList';

// const mockStore = configureStore([]);

const funcDummies = {
  loadSnapshots: hostId => null,
  deleteAction: hostId => null,
  rollbackAction: hostId => null,
  updateAction: hostId => null,
};
const host = {
  id: 42,
  name: 'deep.thought',
};
const testSnapshots = [
  {
    id: 'snapshot-15776',
    name: 'test',
    description: '123 testSnapshot',
    created_at: '2021-01-19 15:03:47 UTC',
  },
  {
    id: 'snapshot-17285',
    name: 'Hello',
    description: 'World\nHow are you?',
    created_at: '2021-04-28 10:22:06 UTC',
  },
];
const fixtures = {
  'without optional Props': { host, ...funcDummies },
  loading: { host, isLoading: true, ...funcDummies },
  working: { host, isWorking: true, ...funcDummies },
  error: {
    host,
    hasError: true,
    error: { message: 'TEST' },
    ...funcDummies,
  },
  'snapshot list': { host, snapshots: testSnapshots, ...funcDummies },
  'without any permissions': {
    host,
    snapshots: testSnapshots,
    canUpdate: false,
    canRevert: false,
    canDelete: false,
    ...funcDummies,
  },
  'without delete permission': {
    host,
    snapshots: testSnapshots,
    canUpdate: true,
    canRevert: true,
    canDelete: false,
    ...funcDummies,
  },
};

describe('SnapshotList', () => {
  /*
  let store;
  let component;

  beforeEach(() => {
    store = mockStore({
      myState: 'sample text',
    });
    component = renderer.create(
      <Provider store={store}>
        <SnapshotList />
      </Provider>
    );
  });
  */
  describe('renders', () =>
    testComponentSnapshotsWithFixtures(SnapshotList, fixtures));
});
