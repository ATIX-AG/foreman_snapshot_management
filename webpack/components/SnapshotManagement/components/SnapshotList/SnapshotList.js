import React, { Component } from 'react';
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

class SnapshotList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      prevSnapshots: props.snapshots,
      rows: cloneDeep(props.snapshots),
    };
    this.inlineEditController = this.defineInlineEditController();
  }

  componentDidMount() {
    this.props.loadSnapshots(this.props.host.id);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.snapshots !== state.prevSnapshots) {
      return {
        prevSnapshots: props.snapshots,
        rows: cloneDeep(props.snapshots),
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props && this.props.needsReload) {
      this.props.loadSnapshots(this.props.host.id);
    }
  }

  defineInlineEditController() {
    const { host, updateAction } = this.props;

    return {
      isEditing: ({ rowData }) => rowData.backup !== undefined,
      onActivate: ({ rowData }) => {
        const rows = cloneDeep(this.state.rows);
        const index = findIndex(rows, { id: rowData.id });

        rows[index].backup = cloneDeep(rows[index]);

        this.setState({ rows, editMode: true });
      },
      onConfirm: ({ rowData }) => {
        const rows = cloneDeep(this.state.rows);
        const index = findIndex(rows, { id: rowData.id });

        delete rows[index].backup;

        this.setState({ rows, editMode: false });
        updateAction(host, rows[index]);
      },
      onCancel: ({ rowData }) => {
        const rows = cloneDeep(this.state.rows);
        const index = findIndex(rows, { id: rowData.id });

        rows[index] = cloneDeep(rows[index].backup);
        delete rows[index].backup;

        this.setState({ rows, editMode: false });
      },
      onChange: (value, { rowData, property }) => {
        const rows = cloneDeep(this.state.rows);
        const index = findIndex(rows, { id: rowData.id });

        rows[index][property] = value;

        this.setState({ rows });
      },
    };
  }

  getBodyMessage() {
    if (this.props.isLoading || this.props.isWorking)
      return <Loading textSize="sm" />;

    if (this.props.hasError)
      return (
        <Alert
          variant="danger"
          isInline
          title={__('Failed to load snapshot list')}
          ouiaId="snapshot-list-error"
        >
          {this.props.error?.message}
        </Alert>
      );

    return undefined;
  }

  renderCell(rowData, property, isEditingRow) {
    const { capabilities } = this.props;
    const value = rowData[property];
    const editable = property !== 'name' || capabilities.editableSnapshotName;

    if (isEditingRow && editable) {
      const Input = property === 'description' ? TextArea : TextInput;
      return (
        <Input
          aria-label={property}
          value={value || ''}
          onChange={(_event, newValue) =>
            this.inlineEditController.onChange(newValue, {
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
  }

  render() {
    const {
      canDelete,
      canRevert,
      canUpdate,
      host,
      deleteAction,
      rollbackAction,
    } = this.props;
    const { rows, editMode } = this.state;
    const bodyMessage = this.getBodyMessage();
    const hasActions = canDelete || canUpdate || canRevert;
    const renderButtons = renderListEntryButtons(
      canDelete,
      canRevert,
      canUpdate,
      host,
      rollbackAction,
      deleteAction,
      this.inlineEditController
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
            <Tr ouiaId="snapshot-list-row">
              <Th>{__('Snapshot')}</Th>
              <Th>{__('Description')}</Th>
              {hasActions && <Th>{__('Action')}</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {bodyMessage && (
              <Tr ouiaId="snapshot-list-row">
                <Td colSpan={columnCount}>{bodyMessage}</Td>
              </Tr>
            )}
            {!bodyMessage && rows.length === 0 && (
              <Tr ouiaId="snapshot-list-row">
                <Td colSpan={columnCount}>
                  <EmptyState>
                    <EmptyStateBody>{__('No snapshots found')}</EmptyStateBody>
                  </EmptyState>
                </Td>
              </Tr>
            )}
            {!bodyMessage &&
              rows.map(rowData => {
                const isEditingRow = this.inlineEditController.isEditing({
                  rowData,
                });
                return (
                  <Tr key={rowData.id} ouiaId={`snapshot-row-${rowData.id}`}>
                    <Td dataLabel={__('Snapshot')}>
                      {this.renderCell(rowData, 'name', isEditingRow)}
                    </Td>
                    <Td dataLabel={__('Description')}>
                      {this.renderCell(rowData, 'description', isEditingRow)}
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
  }
}

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
  needsReload: PropTypes.bool,
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
  needsReload: false,
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
