import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import { API } from 'foremanReact/redux/API';

import {
  loadSnapshotList,
  snapshotDeleteAction,
  snapshotRollbackAction,
  snapshotUpdateAction,
} from '../SnapshotManagementActions';

jest.mock('foremanReact/redux/API/API');

const successResponse = {
  data: 'some-data',
};

const doLoadSnapshotList = (hostId, serverMock) => {
  API.get.mockImplementation(serverMock);

  return loadSnapshotList(hostId);
};

const doDeleteSnapshot = (host, rowData, serverMock) => {
  API.delete.mockImplementation(serverMock);

  return snapshotDeleteAction(host, rowData);
};

const doRollbackSnapshot = (host, rowData, serverMock) => {
  API.put.mockImplementation(serverMock);

  return snapshotRollbackAction(host, rowData);
};

const doUpdateSnapshot = (host, rowData, serverMock) => {
  API.put.mockImplementation(serverMock);

  return snapshotUpdateAction(host, rowData);
};

const listFixtures = {
  'should load snapshots and success': () =>
    doLoadSnapshotList(42, async () => successResponse),

  'should load snapshots and fail': () =>
    doLoadSnapshotList(42, async () => {
      throw new Error('some-error');
    }),
};

describe('Snapshot list actions', () =>
  testActionSnapshotWithFixtures(listFixtures));

const deleteFixtures = {
  'should delete snapshot and success': () =>
    doDeleteSnapshot(
      { id: 42, name: 'deep.thought' },
      { id: 'snapshot-0815', name: 'Savegame' },
      async () => successResponse
    ),

  'should load snapshots and fail': () =>
    doDeleteSnapshot(
      { id: 42, name: 'deep.thought' },
      { id: 'snapshot-0815', name: 'Savegame' },
      async () => {
        throw new Error('some-error');
      }
    ),
};

describe('Snapshot snapshot-delete actions', () =>
  testActionSnapshotWithFixtures(deleteFixtures));

const rollbackFixtures = {
  'should rollback snapshot and success': () =>
    doRollbackSnapshot(
      { id: 42, name: 'deep.thought' },
      { id: 'snapshot-0815', name: 'Savegame' },
      async () => successResponse
    ),

  'should load snapshots and fail': () =>
    doRollbackSnapshot(
      { id: 42, name: 'deep.thought' },
      { id: 'snapshot-0815', name: 'Savegame' },
      async () => {
        throw new Error('some-error');
      }
    ),
};

describe('Snapshot snapshot-rollback actions', () =>
  testActionSnapshotWithFixtures(rollbackFixtures));

const updateFixtures = {
  'should update snapshot and success': () =>
    doUpdateSnapshot(
      { id: 42, name: 'deep.thought' },
      {
        id: 'snapshot-0815',
        name: 'Savegame',
        description: 'Saw the three headed monkey!',
      },
      async () => successResponse
    ),

  'should load snapshots and fail': () =>
    doUpdateSnapshot(
      { id: 42, name: 'deep.thought' },
      {
        id: 'snapshot-0815',
        name: 'Savegame',
        description: 'Saw the three headed monkey!',
      },
      async () => {
        throw new Error('some-error');
      }
    ),
};

describe('Snapshot snapshot-update actions', () =>
  testActionSnapshotWithFixtures(updateFixtures));
