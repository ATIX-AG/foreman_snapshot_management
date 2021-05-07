const snapshotMgmt = state => state.foremanSnapshotManagement;

export const selectSnapshots = state => snapshotMgmt(state).snapshots;
export const selectIsLoading = state => snapshotMgmt(state).isLoading;
export const selectIsWorking = state => snapshotMgmt(state).isWorking;
export const selectHasError = state => snapshotMgmt(state).hasError;
export const selectError = state => snapshotMgmt(state).error;
export const selectNeedsReload = state => snapshotMgmt(state).needsReload;
