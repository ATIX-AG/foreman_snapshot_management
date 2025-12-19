import React from 'react';

import { registerReducer } from 'foremanReact/common/MountingService';
import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';

import reducers from './reducers';
import SnapshotManagementCard from './components/SnapshotManagementCard';

import BulkCreateSnapshotMenuItem from './components/SnapshotManagement/components/BulkActions/BulkCreateSnapshotMenuItem/BulkCreateSnapshotMenuItem';
import BulkSnapshotModalScene from './components/SnapshotManagement/components/BulkActions/BulkSnapshotModalScene/BulkSnapshotModalScene';

// register reducers
Object.entries(reducers).forEach(([key, reducer]) =>
  registerReducer(key, reducer)
);

// register HostDetails-Fill
addGlobalFill(
  'host-overview-cards',
  'foreman_snapshot_management-card',
  <SnapshotManagementCard key="foreman_snapshot_management-card" />,
  1000
);

addGlobalFill(
  '_all-hosts-modals',
  'foreman_snapshot_management-bulk-modal',
  <BulkSnapshotModalScene key="foreman_snapshot_management-bulk-modal" />,
  500
);

addGlobalFill(
  'hosts-index-kebab',
  'foreman_snapshot_management-bulk-create',
  <BulkCreateSnapshotMenuItem key="foreman_snapshot_management-bulk-create" />,
  500
);
