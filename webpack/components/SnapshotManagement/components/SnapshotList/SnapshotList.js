import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  EmptyState,
  EmptyStateBody,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { cloneDeep, findIndex } from 'lodash';

import { translate as __ } from 'foremanReact/common/I18n';
import ShortDateTime from 'foremanReact/components/common/dates/ShortDateTime';
import Loading from 'foremanReact/components/Loading/Loading';
import 'foremanReact/redux/API';

import { renderListEntryButtons } from './SnapshotListHelper';
import './snapshotList.scss';

const SnapshotList = ({
  host,
  loadSnapshots,
  deleteAction,
  updateAction,
  rollbackAction,
  isLoading,
  isWorking,
  hasError,
  error,
  snapshots,
  canDelete,
  canRevert,
  canUpdate,
  capabilities,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [rows, setRows] = useState(() => cloneDeep(snapshots));

  useEffect(() => {
    loadSnapshots(host.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setRows(cloneDeep(snapshots));
  }, [snapshots]);

  const updateRow = (rowData, change) =>
    setRows(currentRows => {
      const newRows = cloneDeep(currentRows);
      const index = findIndex(newRows, { id: rowData.id });
      return change(newRows, index);
    });

  const inlineEditController = {
    isEditing: ({ rowData }) => rowData.backup !== undefined,
    onActivate: ({ rowData }) => {
      updateRow(rowData, (newRows, index) => {
        newRows[index].backup = cloneDeep(newRows[index]);
        return newRows;
      });
      setEditMode(true);
    },
    onConfirm: ({ rowData }) => {
      const index = findIndex(rows, { id: rowData.id });
      const updated = cloneDeep(rows[index]);
      delete updated.backup;

      updateRow(rowData, (newRows, i) => {
        delete newRows[i].backup;
        return newRows;
      });
      setEditMode(false);
      updateAction(host, updated);
    },
    onCancel: ({ rowData }) => {
      updateRow(rowData, (newRows, index) => {
        newRows[index] = cloneDeep(newRows[index].backup);
        delete newRows[index].backup;
        return newRows;
      });
      setEditMode(false);
    },
    onChange: (value, { rowData, property }) => {
      updateRow(rowData, (newRows, index) => {
        newRows[index][property] = value;
        return newRows;
      });
    },
  };

  const getBodyMessage = () => {
    if (isLoading || isWorking) return <Loading textSize="sm" />;

    if (hasError)
      return (
        <Alert
          variant="danger"
          isInline
          title={__('Failed to load snapshot list')}
          ouiaId="snapshot-list-error"
        >
          {error?.message}
        </Alert>
      );

    return undefined;
  };

  const renderCell = (rowData, property, isEditingRow) => {
    const value = rowData[property];
    const editable = property !== 'name' || capabilities.editableSnapshotName;

    if (isEditingRow && editable) {
      const Input = property === 'description' ? TextArea : TextInput;
      return (
        <Input
          aria-label={property}
          value={value || ''}
          onChange={(_event, newValue) =>
            inlineEditController.onChange(newValue, {
              rowData,
              property,
            })
          }
          {...(property === 'description'
            ? {}
            : { ouiaId: `snapshot-${property}-input` })}
        />
      );
    }

    return (
      <span className="static description">
        {value}
        <br />
        {property === 'name' && rowData.formatted_created_at && (
          <span className="snapshot-date">
            <ShortDateTime
              date={new Date(rowData.formatted_created_at)}
              defaultValue={__('N/A')}
              showRelativeTimeTooltip
            />
          </span>
        )}
      </span>
    );
  };

  const bodyMessage = getBodyMessage();
  const hasActions = canDelete || canUpdate || canRevert;
  const renderButtons = renderListEntryButtons(
    canDelete,
    canRevert,
    canUpdate,
    host,
    rollbackAction,
    deleteAction,
    inlineEditController
  );
  const columnCount = hasActions ? 3 : 2;

  return (
    <div>
      <Table
        aria-label={__('Snapshot List')}
        variant="compact"
        ouiaId="snapshot-list-table"
      >
        <Thead>
          <Tr ouiaId="snapshot-list-row-head">
            <Th>{__('Snapshot')}</Th>
            <Th>{__('Description')}</Th>
            {hasActions && <Th>{__('Action')}</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {bodyMessage && (
            <Tr ouiaId="snapshot-list-rows">
              <Td colSpan={columnCount}>{bodyMessage}</Td>
            </Tr>
          )}
          {!bodyMessage && rows.length === 0 && (
            <Tr ouiaId="snapshot-list-row-empty">
              <Td colSpan={columnCount}>
                <EmptyState>
                  <EmptyStateBody>{__('No snapshots found')}</EmptyStateBody>
                </EmptyState>
              </Td>
            </Tr>
          )}
          {!bodyMessage &&
            rows.map(rowData => {
              const isEditingRow = inlineEditController.isEditing({ rowData });
              return (
                <Tr key={rowData.id} ouiaId={`snapshot-row-${rowData.id}`}>
                  <Td dataLabel={__('Snapshot')}>
                    {renderCell(rowData, 'name', isEditingRow)}
                  </Td>
                  <Td dataLabel={__('Description')}>
                    {renderCell(rowData, 'description', isEditingRow)}
                  </Td>
                  {hasActions && (
                    <Td
                      dataLabel={__('Action')}
                      className="action-buttons"
                      isActionCell
                    >
                      {renderButtons(rowData, isEditingRow, editMode)}
                    </Td>
                  )}
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </div>
  );
};

SnapshotList.propTypes = {
  /*
  children: PropTypes.node,
  className: PropTypes.string,
  */
  host: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  loadSnapshots: PropTypes.func.isRequired,
  deleteAction: PropTypes.func.isRequired,
  updateAction: PropTypes.func.isRequired,
  rollbackAction: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isWorking: PropTypes.bool,
  hasError: PropTypes.bool,
  error: PropTypes.shape({ message: PropTypes.string }),
  snapshots: PropTypes.array,

  // permissions:
  canDelete: PropTypes.bool,
  canRevert: PropTypes.bool,
  canUpdate: PropTypes.bool,

  // capabilities
  capabilities: PropTypes.shape({
    editableSnapshotName: PropTypes.bool,
  }),
};

SnapshotList.defaultProps = {
  /*
  className: '',
  children: null,
  */
  isLoading: true,
  isWorking: false,
  hasError: false,
  error: undefined,
  snapshots: [],
  canDelete: false,
  canRevert: false,
  canUpdate: false,
  capabilities: {
    editableSnapshotName: true,
  },
};

export default SnapshotList;
