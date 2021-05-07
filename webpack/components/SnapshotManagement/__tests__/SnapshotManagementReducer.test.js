import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';
import Immutable from 'seamless-immutable';

import { actionTypeGenerator } from 'foremanReact/redux/API';

import {
  SNAPSHOT_LIST,
  SNAPSHOT_DELETE,
  SNAPSHOT_ROLLBACK,
  SNAPSHOT_UPDATE,
} from '../SnapshotManagementConstants';
import reducer, { initialState } from '../SnapshotManagementReducer';

const listTypes = actionTypeGenerator(SNAPSHOT_LIST);
const deleteTypes = actionTypeGenerator(SNAPSHOT_DELETE);
const rollbackTypes = actionTypeGenerator(SNAPSHOT_ROLLBACK);
const updateTypes = actionTypeGenerator(SNAPSHOT_UPDATE);

const idleState = Immutable({
  isLoading: false,
  isWorking: false,
  hasError: false,
  snapshots: [
    {
      id: 'snapshot-15776',
      name: 'test',
      description: '123 testSnapshot',
      created_at: '2021-01-19 15:03:47 UTC',
      parent_id: null,
      children_ids: null,
    },
  ],
});

const fixtures = {
  'should return initial state': {
    state: initialState,
    action: {
      type: undefined,
      payload: {},
    },
  },
  'should handle LIST_REQUEST': {
    state: idleState,
    action: {
      type: listTypes.REQUEST,
      // response: ,
    },
  },
  'should handle LIST_SUCCESS': {
    state: idleState,
    action: {
      type: listTypes.SUCCESS,
      payload: {},
      response: {
        results: [],
      },
    },
  },
  'should handle LIST_FAILURE': {
    state: idleState,
    action: {
      type: listTypes.FAILURE,
      payload: {},
      response: {
        message: 'Something went wrong',
      },
    },
  },
  'should handle ROLLBACK_REQUEST': {
    state: idleState,
    action: {
      type: rollbackTypes.REQUEST,
      // response: ,
    },
  },
  'should handle ROLLBACK_SUCCESS': {
    state: idleState,
    action: {
      type: rollbackTypes.SUCCESS,
      payload: {},
      response: {
        results: [],
      },
    },
  },
  'should handle ROLLBACK_FAILURE': {
    state: idleState,
    action: {
      type: rollbackTypes.FAILURE,
      payload: {},
      response: {
        message: 'Something went wrong',
      },
    },
  },
  'should handle DELETE_REQUEST': {
    state: idleState,
    action: {
      type: deleteTypes.REQUEST,
      // response: ,
    },
  },
  'should handle DELETE_SUCCESS': {
    state: idleState,
    action: {
      type: deleteTypes.SUCCESS,
      payload: {},
      response: {
        results: [],
      },
    },
  },
  'should handle DELETE_FAILURE': {
    state: idleState,
    action: {
      type: deleteTypes.FAILURE,
      payload: {},
      response: {
        message: 'Something went wrong',
      },
    },
  },
  'should handle UPDATE_REQUEST': {
    state: idleState,
    action: {
      type: updateTypes.REQUEST,
      // response: ,
    },
  },
  'should handle UPDATE_SUCCESS': {
    state: idleState,
    action: {
      type: updateTypes.SUCCESS,
      payload: {},
      response: {
        id: 'snapshot-15776',
        name: 'test snapshot',
        description: 'My most important snapshot.',
        created_at: '2021-01-19 15:03:47 UTC',
      },
    },
  },
  'should handle UPDATE_FAILURE': {
    state: idleState,
    action: {
      type: updateTypes.FAILURE,
      payload: {},
      response: {
        message: 'Something went wrong',
      },
    },
  },
};

describe('SnapshotManagementReducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
