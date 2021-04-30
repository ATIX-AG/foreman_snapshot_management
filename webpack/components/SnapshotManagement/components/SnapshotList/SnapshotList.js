import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  // Button,
  Table as PfTable,
  FormControl,
  inlineEditFormatterFactory,
} from 'patternfly-react';
import { cloneDeep, findIndex } from 'lodash';

import { translate as __ } from 'foremanReact/common/I18n';
import {
  Table,
  TableBody,
  column,
  headerFormatterWithProps,
  cellFormatterWithProps,
} from 'foremanReact/components/common/table';
import ShortDateTime from 'foremanReact/components/common/dates/ShortDateTime';
import AlertBody from 'foremanReact/components/common/Alert/AlertBody';
import Loading from 'foremanReact/components/Loading/Loading';
import 'foremanReact/redux/API';

import { renderListEntryButtons } from './SnapshotListHelper';
import './snapshotList.scss';

class SnapshotList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.defineColumns(),
      editMode: false,
      rows: cloneDeep(props.snapshots),
    };
  }

  defineColumns() {
    const {
      canDelete,
      canRevert,
      canUpdate,
      host,
      deleteAction,
      updateAction,
      rollbackAction,
    } = this.props;

    const inlineEditController = {
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
        updateAction(host, rowData);
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
    this.inlineEditController = inlineEditController;

    const renderButtons = renderListEntryButtons(
      canDelete,
      canRevert,
      canUpdate,
      host,
      rollbackAction,
      deleteAction,
      inlineEditController
    );
    const inlineEditButtonCellFormatter = inlineEditFormatterFactory({
      isEditing: additionalData => this.state.editMode,
      renderValue: renderButtons(false),
      renderEdit: renderButtons(true),
    });

    const inlineEditFormatter = inlineEditFormatterFactory({
      isEditing: additionalData =>
        inlineEditController.isEditing(additionalData),
      renderValue: (value, additionalData) => {
        let date = '';
        if (additionalData.property === 'name')
          date = (
            <span className="snapshot-date">
              <ShortDateTime
                date={new Date(additionalData.rowData.formatted_created_at)}
                defaultValue={__('N/A')}
                showRelativeTimeTooltip
              />
            </span>
          );
        return (
          <span className="static description">
            {value}
            <br />
            {date}
          </span>
        );
      },
      renderEdit: (value, additionalData) => {
        let type = 'input';
        if (additionalData.property === 'description') type = 'textarea';
        return (
          <FormControl
            type="text"
            defaultValue={value}
            onBlur={e =>
              inlineEditController.onChange(e.target.value, additionalData)
            }
            componentClass={type}
          />
        );
      },
    });
    const editCellFormatters = [cellFormatterWithProps];
    if (canUpdate) editCellFormatters.unshift(inlineEditFormatter);

    const columns = [
      column(
        'name',
        __('Snapshot'),
        [headerFormatterWithProps],
        editCellFormatters
      ),
      column(
        'description',
        __('Description'),
        [headerFormatterWithProps],
        editCellFormatters
      ),
    ];
    if (canDelete || canUpdate || canRevert)
      columns.push(
        column(
          '',
          __('Action'),
          [headerFormatterWithProps],
          [inlineEditButtonCellFormatter],
          { className: 'action-buttons' }
        )
      );
    return columns;
  }

  componentDidMount() {
    this.props.loadSnapshots(this.props.host.id);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.snapshots !== this.props.snapshots) {
      this.setState({ rows: newProps.snapshots });
    }
    if (newProps.needsReload) {
      newProps.loadSnapshots(newProps.host.id);
    }
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
        >
          <AlertBody title={__('Failed to load snapshot list')}>
            {/* IMHO the line-break should be done by AlertBody :-( */}
            <br />
            {this.props.error.message}
          </AlertBody>
        </Alert>
      );

    return undefined;
  }

  render() {
    const { columns } = this.state;
    const bodyMessage = this.getBodyMessage();

    return (
      <div>
        {/*
        <Button
          disabled={this.props.isLoading}
          onClick={() => this.props.loadSnapshots(this.props.host.id)}
        >
          ReloadData
        </Button>
        */}
        <Table
          caption="Snapshot List"
          columns={columns}
          rows={this.state.rows}
          bodyMessage={bodyMessage}
          inlineEdit
          components={{
            body: {
              row: PfTable.InlineEditRow,
              cell: cellProps => cellProps.children,
            },
          }}
        >
          <PfTable.Header key="header" />
          <TableBody
            key="body"
            columns={columns}
            rows={this.state.rows}
            message={bodyMessage}
            rowKey="id"
            onRow={(rowData, { rowIndex }) => ({
              role: 'row',
              isEditing: () => this.inlineEditController.isEditing({ rowData }),
              onCancel: () =>
                this.inlineEditController.onCancel({ rowData, rowIndex }),
              onConfirm: () =>
                this.inlineEditController.onConfirm({ rowData, rowIndex }),
              last: rowIndex === this.state.rows.length - 1,
            })}
          />
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
  isLoading: PropTypes.bool,
  isWorking: PropTypes.bool,
  hasError: PropTypes.bool,
  error: PropTypes.shape({ message: PropTypes.string }),
  snapshots: PropTypes.array,

  // permissions:
  canDelete: PropTypes.bool,
  canRevert: PropTypes.bool,
  canUpdate: PropTypes.bool,
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
};

export default SnapshotList;
