import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'patternfly-react';

import { translate as __ } from 'foremanReact/common/I18n';

import SnapshotFormModal from './components/SnapshotFormModal';
import useSnapshotFormModal from './components/SnapshotFormModal/useSnapshotFormModal';
import SnapshotList from './components/SnapshotList/SnapshotList';
import './snapshotManagement.scss';

const SnapshotManagement = ({ canCreate, host, ...props }) => {
  const children = [];
  const { setModalOpen, setModalClosed } = useSnapshotFormModal();

  const onCreateClick = () => {
    setModalOpen();
  };
  const allowedHostAttr = ['id', 'name'];
  const filteredHost = Object.keys(host)
    .filter(key => allowedHostAttr.includes(key))
    .reduce(
      (obj, key) => ({
        ...obj,
        [key]: host[key],
      }),
      {}
    );

  if (canCreate) {
    children.push(
      <SnapshotFormModal
        key="snapshot-form-modal"
        setModalClosed={setModalClosed}
        host={filteredHost}
        hostId={host.id}
        {...props}
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
  }).isRequired,
  canCreate: PropTypes.bool,
  canUpdate: PropTypes.bool,
  canRevert: PropTypes.bool,
  canDelete: PropTypes.bool,
};

SnapshotManagement.defaultProps = {
  canCreate: false,
  canUpdate: false,
  canRevert: false,
  canDelete: false,
};

export default SnapshotManagement;
