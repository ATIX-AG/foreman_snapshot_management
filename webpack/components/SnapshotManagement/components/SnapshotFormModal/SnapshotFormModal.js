import React from 'react';
import PropTypes from 'prop-types';

import ForemanModal from 'foremanReact/components/ForemanModal';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';

import SnapshotForm from '../SnapshotForm';

import { SNAPSHOT_FORM_MODAL } from './SnapshotFormModalConstants';

const SnapshotFormModal = ({ host, setModalClosed, ...props }) => (
  <ForemanModal
    id={SNAPSHOT_FORM_MODAL}
    title={sprintf(__('Create Snapshot for %s'), host.name)}
    enforceFocus
  >
    <ForemanModal.Header closeButton={false} />

    <div>
      <SnapshotForm
        setModalClosed={setModalClosed}
        hostId={host.id}
        {...props}
      />
    </div>
  </ForemanModal>
);

SnapshotFormModal.propTypes = {
  host: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  setModalClosed: PropTypes.func.isRequired,
};

export default SnapshotFormModal;
