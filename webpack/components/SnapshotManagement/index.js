import { connect } from 'react-redux';

import {
  loadSnapshotList,
  snapshotDeleteAction,
  snapshotUpdateAction,
  snapshotRollbackAction,
} from './SnapshotManagementActions';
import SnapshotManagement from './SnapshotManagement';
import * as Selector from './SnapshotManagementSelectors';

// process state from redux store
const mapStateToProps = state => ({
  snapshots: Selector.selectSnapshots(state),
  isLoading: Selector.selectIsLoading(state),
  isWorking: Selector.selectIsWorking(state),
  hasError: Selector.selectHasError(state),
  error: Selector.selectError(state),
  needsReload: Selector.selectNeedsReload(state),
});

// dispatch actions from Component to Store
const mapDispatchToProps = dispatch => ({
  loadSnapshots: host => dispatch(loadSnapshotList(host)),
  deleteAction: (hostId, rowData) =>
    dispatch(snapshotDeleteAction(hostId, rowData)),
  updateAction: (hostId, rowData) =>
    dispatch(snapshotUpdateAction(hostId, rowData)),
  rollbackAction: (hostId, rowData) =>
    dispatch(snapshotRollbackAction(hostId, rowData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SnapshotManagement);
