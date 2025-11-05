export const SNAPSHOT_LIST = 'FOREMAN_SNAPSHOT_MANAGEMENT_SNAPSHOT_LIST';
export const SNAPSHOT_LIST_URL = '/api/hosts/:host_id/snapshots/';
export const SNAPSHOT_DELETE = 'FOREMAN_SNAPSHOT_MANAGEMENT_SNAPSHOT_DELETE';
export const SNAPSHOT_DELETE_URL = '/api/hosts/%s/snapshots/%s/';
export const SNAPSHOT_UPDATE = 'FOREMAN_SNAPSHOT_MANAGEMENT_SNAPSHOT_UPDATE';
export const SNAPSHOT_UPDATE_URL = '/api/hosts/%s/snapshots/%s/';
export const SNAPSHOT_ROLLBACK =
  'FOREMAN_SNAPSHOT_MANAGEMENT_SNAPSHOT_ROLLBACK';
export const SNAPSHOT_ROLLBACK_URL = '/api/hosts/%s/snapshots/%s/revert';
export const SNAPSHOT_BULK_CREATE = 'SNAPSHOT_BULK_CREATE';
export const SNAPSHOT_BULK_CREATE_URL =
  '/api/v2/snapshots/bulk/create_snapshot';
