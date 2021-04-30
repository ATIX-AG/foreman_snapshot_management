import { API, actionTypeGenerator } from 'foremanReact/redux/API';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { addToast } from 'foremanReact/redux/actions/toasts';

import {
  SNAPSHOT_LIST,
  SNAPSHOT_LIST_URL,
  SNAPSHOT_DELETE,
  SNAPSHOT_DELETE_URL,
  SNAPSHOT_UPDATE,
  SNAPSHOT_UPDATE_URL,
  SNAPSHOT_ROLLBACK,
  SNAPSHOT_ROLLBACK_URL,
} from './SnapshotManagementConstants';

export const loadSnapshotList = hostId => async dispatch => {
  const { REQUEST, SUCCESS, FAILURE } = actionTypeGenerator(SNAPSHOT_LIST);

  dispatch({
    type: REQUEST,
    payload: { hostId },
  });
  try {
    const { data } = await API.get(
      SNAPSHOT_LIST_URL.replace(':host_id', hostId)
    );
    return dispatch({
      type: SUCCESS,
      payload: { hostId },
      response: data,
    });
  } catch (error) {
    return dispatch({
      type: FAILURE,
      payload: { hostId },
      response: error,
    });
  }
};

export const snapshotDeleteAction = (host, rowData) => async dispatch => {
  const { REQUEST, SUCCESS, FAILURE } = actionTypeGenerator(SNAPSHOT_DELETE);

  dispatch({
    type: REQUEST,
    payload: {
      host,
      id: rowData.id,
    },
  });
  try {
    const { data } = await API.delete(
      sprintf(SNAPSHOT_DELETE_URL, host.id, rowData.id)
    );

    dispatch(
      addToast({
        type: 'success',
        message: sprintf(
          __('Successfully removed Snapshot "%s" from host %s'),
          rowData.name,
          host.name
        ),
        key: SUCCESS,
      })
    );
    dispatch(loadSnapshotList(host.id));
    return dispatch({
      type: SUCCESS,
      payload: {
        host,
        id: rowData.id,
      },
      response: data,
    });
  } catch (error) {
    dispatch(
      addToast({
        type: 'error',
        message: sprintf(
          __('Error occurred while removing Snapshot: %s'),
          error
        ),
        key: FAILURE,
      })
    );
    return dispatch({
      type: FAILURE,
      payload: {
        host,
        id: rowData.id,
      },
      response: error,
    });
  }
};

export const snapshotUpdateAction = (host, rowData) => async dispatch => {
  const { REQUEST, SUCCESS, FAILURE } = actionTypeGenerator(SNAPSHOT_UPDATE);

  dispatch({
    type: REQUEST,
    payload: {
      host,
      id: rowData.id,
      snapshot: {
        name: rowData.name,
        description: rowData.description,
      },
    },
  });
  try {
    const { data } = await API.put(
      sprintf(SNAPSHOT_UPDATE_URL, host.id, rowData.id),
      {
        snapshot: {
          name: rowData.name,
          description: rowData.description,
        },
      }
    );
    dispatch(
      addToast({
        type: 'success',
        message: sprintf(
          __('Successfully updated Snapshot "%s"'),
          rowData.name
        ),
        key: SUCCESS,
      })
    );
    return dispatch({
      type: SUCCESS,
      payload: {
        host,
        id: rowData.id,
      },
      response: data,
    });
  } catch (error) {
    dispatch(
      addToast({
        type: 'error',
        message: sprintf(
          __('Error occurred while updating Snapshot: %s'),
          error
        ),
        key: FAILURE,
      })
    );
    return dispatch({
      type: FAILURE,
      payload: {
        host,
        id: rowData.id,
      },
      response: error,
    });
  }
};

export const snapshotRollbackAction = (host, rowData) => async dispatch => {
  const { REQUEST, SUCCESS, FAILURE } = actionTypeGenerator(SNAPSHOT_ROLLBACK);

  dispatch({
    type: REQUEST,
    payload: {
      host,
      id: rowData.id,
    },
  });
  try {
    const { data } = await API.put(
      sprintf(SNAPSHOT_ROLLBACK_URL, host.id, rowData.id)
    );
    dispatch(
      addToast({
        type: 'success',
        message: sprintf(
          __('Successfully rolled back Snapshot "%s" on host %s'),
          rowData.name,
          host.name
        ),
        key: SUCCESS,
      })
    );
    return dispatch({
      type: SUCCESS,
      payload: {
        host,
        id: rowData.id,
      },
      response: data,
    });
  } catch (error) {
    dispatch(
      addToast({
        type: 'error',
        message: sprintf(__('Error occurred while rolling back VM: %s'), error),
        key: FAILURE,
      })
    );
    return dispatch({
      type: FAILURE,
      payload: {
        host,
        id: rowData.id,
      },
      response: error,
    });
  }
};
