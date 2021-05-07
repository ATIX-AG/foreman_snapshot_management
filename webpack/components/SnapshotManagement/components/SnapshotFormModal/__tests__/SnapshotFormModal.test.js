import {
  testComponentSnapshotsWithFixtures,
  // shallowRenderComponentWithFixtures,
} from 'react-redux-test-utils';
// import configureStore from 'redux-mock-store';

import SnapshotFormModal from '../SnapshotFormModal';

// const mockStore = configureStore([]);

const setModalClosed = () => null;
const fixtures = {
  normal: { host: { id: 42, name: 'deep.thought' }, setModalClosed },
};

describe('SnapshotFormModal', () => {
  describe('renders', () =>
    testComponentSnapshotsWithFixtures(SnapshotFormModal, fixtures));
});
