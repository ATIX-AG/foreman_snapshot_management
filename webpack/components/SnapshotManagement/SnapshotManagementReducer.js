// This is an example for a generic redux's reducer
// Reducers should be registered to foreman-core
// For a further registration demonstration, have a look in `webpack/global_index.js`

import Immutable from 'seamless-immutable';
import { cloneDeep, findIndex } from 'lodash';

import { actionTypeGenerator } from 'foremanReact/redux/API';

import {
  SNAPSHOT_LIST,
  SNAPSHOT_DELETE,
  SNAPSHOT_UPDATE,
  SNAPSHOT_ROLLBACK,
} from './SnapshotManagementConstants';

export const initialState = Immutable({
  isLoading: true,
  isWorking: false,
  hasError: false,
  snapshots: [],
});

export default (state = initialState, action) => {
  const { response } = action;

  const listTypes = actionTypeGenerator(SNAPSHOT_LIST);
  const deleteTypes = actionTypeGenerator(SNAPSHOT_DELETE);
  const updateTypes = actionTypeGenerator(SNAPSHOT_UPDATE);
  const rollbackTypes = actionTypeGenerator(SNAPSHOT_ROLLBACK);

  switch (action.type) {
    case 'SNAPSHOT_FORM_SUBMITTED':
      return state.merge({
        needsReload: true,
      });
    case listTypes.REQUEST:
      return state.merge({
        snapshots: [],
        isLoading: true,
        hasError: false,
        needsReload: false,
      });
    case listTypes.SUCCESS:
      return state.merge({
        snapshots: response.results,
        isLoading: false,
        needsReload: false,
      });
    case listTypes.FAILURE:
      return state.merge({
        error: response,
        hasError: true,
        isLoading: false,
        needsReload: false,
      });
    case deleteTypes.REQUEST:
      return state.merge({
        isWorking: true,
      });
    case deleteTypes.SUCCESS:
    case deleteTypes.FAILURE:
      return state.merge({
        isWorking: false,
      });
    case updateTypes.REQUEST:
      return state.merge({
        isWorking: true,
      });
    case updateTypes.SUCCESS: {
      const snapshots = cloneDeep(state.snapshots);
      const index = findIndex(snapshots, { id: response.id });

      snapshots[index].name = response.name;
      snapshots[index].description = response.description;

      return state.merge({
        isWorking: false,
        snapshots,
      });
    }
    case updateTypes.FAILURE:
      return state.merge({
        isWorking: false,
      });
    case rollbackTypes.REQUEST:
      return state.merge({
        snapshots: state.snapshots,
        isWorking: true,
      });
    case rollbackTypes.SUCCESS:
    case rollbackTypes.FAILURE:
      return state.merge({
        snapshots: state.snapshots,
        isWorking: false,
      });
    default:
      return state;
  }
};
