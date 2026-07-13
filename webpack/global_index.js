import React from 'react';

import { registerReducer } from 'foremanReact/common/MountingService';
import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';

import reducers from './reducers';
import SnapshotManagementCard from './components/SnapshotManagementCard';

import BulkCreateSnapshotMenuItem from './components/SnapshotManagement/components/BulkActions/BulkCreateSnapshotMenuItem/BulkCreateSnapshotMenuItem';
import BulkSnapshotModalScene from './components/SnapshotManagement/components/BulkActions/BulkSnapshotModalScene/BulkSnapshotModalScene';

const CARD_FILL_PRIORITY = 1000;
const BULK_ACTION_FILL_PRIORITY = 500;

// register reducers
Object.entries(reducers).forEach(([key, reducer]) =>
  registerReducer(key, reducer)
);

// register HostDetails-Fill
addGlobalFill(
  'host-overview-cards',
  'foreman_snapshot_management-card',
  <SnapshotManagementCard key="foreman_snapshot_management-card" />,
  CARD_FILL_PRIORITY
);

addGlobalFill(
  '_all-hosts-modals',
  'foreman_snapshot_management-bulk-modal',
  <BulkSnapshotModalScene key="foreman_snapshot_management-bulk-modal" />,
  BULK_ACTION_FILL_PRIORITY
);

addGlobalFill(
  'hosts-index-kebab',
  'foreman_snapshot_management-bulk-create',
  <BulkCreateSnapshotMenuItem key="foreman_snapshot_management-bulk-create" />,
  BULK_ACTION_FILL_PRIORITY
);
