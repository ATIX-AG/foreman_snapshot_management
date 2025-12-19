import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'patternfly-react';

import { translate as __ } from 'foremanReact/common/I18n';
import SnapshotFormModal from './components/SnapshotFormModal';
import useSnapshotFormModal from './components/SnapshotFormModal/useSnapshotFormModal';
import SnapshotList from './components/SnapshotList/SnapshotList';
import './snapshotManagement.scss';

const SnapshotManagement = ({
  canCreate,
  host,
  onSubmit,
  hostCapabilities,
  ...props
}) => {
  const children = [];
  const { setModalOpen } = useSnapshotFormModal();

  if (!host) return null;

  const onCreateClick = () => {
    setModalOpen();
  };
  const allowedHostAttr = ['id', 'name'];
  const filteredHost = {
    ...Object.keys(host)
      .filter(key => allowedHostAttr.includes(key))
      .reduce(
        (obj, key) => ({
          ...obj,
          [key]: host[key],
        }),
        {}
      ),
    capabilities: hostCapabilities,
  };

  if (canCreate) {
    children.push(
      <SnapshotFormModal
        key="snapshot-form-modal"
        host={filteredHost}
        onSubmit={onSubmit}
      />
    );
    children.push(
      <Button
        key="snapshot-create-button"
        onClick={onCreateClick}
        className="snapshot-create"
      >
        {__('Create Snapshot')}
      </Button>
    );
  }

  children.push(
    <SnapshotList key="snapshot-list" host={filteredHost} {...props} />
  );

  return <div>{children}</div>;
};

SnapshotManagement.propTypes = {
  host: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    capabilities: PropTypes.shape({
      editableSnapshotName: PropTypes.bool,
      limitSnapshotNameFormat: PropTypes.bool,
      quiesceOption: PropTypes.bool,
    }),
  }),
  canCreate: PropTypes.bool,
  canUpdate: PropTypes.bool,
  canRevert: PropTypes.bool,
  canDelete: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  hostCapabilities: PropTypes.shape({
    editableSnapshotName: PropTypes.bool,
    limitSnapshotNameFormat: PropTypes.bool,
    quiesceOption: PropTypes.bool,
  }),
};

SnapshotManagement.defaultProps = {
  canCreate: false,
  canUpdate: false,
  canRevert: false,
  canDelete: false,
  host: null,
  hostCapabilities: {
    editSnapshotName: true,
    limitSnapshotNameFormat: false,
    quiesceOption: false,
  },
};

export default SnapshotManagement;
