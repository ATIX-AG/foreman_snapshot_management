import React from 'react';
import { Button } from '@patternfly/react-core';
import {
  PencilAltIcon,
  HistoryIcon,
  TrashIcon,
  CheckIcon,
  TimesIcon,
} from '@patternfly/react-icons';

import { sprintf, translate as __ } from 'foremanReact/common/I18n';

import './snapshotList.scss';

export const renderListEntryButtons = (
  canDelete,
  canRevert,
  canUpdate,
  host,
  snapshotRollbackAction,
  snapshotDeleteAction,
  inlineEditController
) => (rowData, isEditingRow, disabled) => {
  if (isEditingRow) {
    return (
      <div className="snapshot-action-buttons">
        <Button
          key="confirm-button"
          variant="plain"
          aria-label={__('Confirm')}
          onClick={() => inlineEditController.onConfirm({ rowData })}
          ouiaId={`snapshot-confirm-button-${rowData.id}`}
        >
          <CheckIcon />
        </Button>
        <Button
          key="cancel-button"
          variant="plain"
          aria-label={__('Cancel')}
          onClick={() => inlineEditController.onCancel({ rowData })}
          ouiaId={`snapshot-cancel-edit-button-${rowData.id}`}
        >
          <TimesIcon />
        </Button>
      </div>
    );
  }

  const buttons = [];

  if (canUpdate) {
    buttons.push(
      <Button
        key="edit-button"
        variant="plain"
        isDisabled={disabled}
        aria-label={__('edit entry')}
        onClick={() => inlineEditController.onActivate({ rowData })}
        ouiaId={`snapshot-edit-button-${rowData.id}`}
      >
        <PencilAltIcon />
      </Button>
    );
  }

  if (canRevert) {
    buttons.push(
      <Button
        key="rollback-button"
        variant="plain"
        isDisabled={disabled}
        aria-label={__('Rollback')}
        onClick={() =>
          window.confirm(sprintf(__('Rollback to "%s"?'), rowData.name)) &&
          snapshotRollbackAction(host, rowData)
        }
        ouiaId={`snapshot-rollback-button-${rowData.id}`}
      >
        <HistoryIcon />
      </Button>
    );
  }

  if (canDelete) {
    buttons.push(
      <Button
        key="delete-button"
        variant="plain"
        isDisabled={disabled}
        aria-label={__('Delete')}
        onClick={() =>
          window.confirm(sprintf(__('Delete Snapshot "%s"?'), rowData.name)) &&
          snapshotDeleteAction(host, rowData)
        }
        ouiaId={`snapshot-delete-button-${rowData.id}`}
      >
        <TrashIcon />
      </Button>
    );
  }

  return <div className="snapshot-action-buttons">{buttons}</div>;
};
