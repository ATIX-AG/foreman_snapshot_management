import React from 'react';

import { registerReducer } from 'foremanReact/common/MountingService';
import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';

import reducers from './reducers';
import SnapshotManagementCard from './components/SnapshotManagementCard';

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
