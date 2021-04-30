import React from 'react';
import { Button, Icon } from 'patternfly-react';

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
) => disabled => (value, additionalData) => {
  const buttons = [];

  // Edit Button
  if (canUpdate) {
    buttons.push(
      <Button
        key="edit-button"
        bsStyle="default"
        disabled={disabled}
        onClick={() => inlineEditController.onActivate(additionalData)}
      >
        <Icon type="pf" name="edit" title={__('edit entry')} />
      </Button>
    );
  }

  // Rollback button
  if (canRevert) {
    buttons.push(
      <Button
        key="rollback-button"
        bsStyle="default"
        disabled={disabled}
        onClick={() =>
          window.confirm(
            sprintf(__('Rollback to "%s"?'), additionalData.rowData.name)
          ) && snapshotRollbackAction(host, additionalData.rowData)
        }
      >
        <Icon type="pf" name="history" title={__('Rollback')} />
      </Button>
    );
  }

  // Delete Button
  if (canDelete) {
    buttons.push(
      <Button
        key="delete-button"
        bsStyle="default"
        disabled={disabled}
        onClick={() =>
          window.confirm(
            sprintf(__('Delete Snapshot "%s"?'), additionalData.rowData.name)
          ) && snapshotDeleteAction(host, additionalData.rowData)
        }
      >
        <Icon type="pf" name="delete" title={__('Delete')} />
      </Button>
    );
  }

  return <td className="action-buttons">{buttons}</td>;
};
