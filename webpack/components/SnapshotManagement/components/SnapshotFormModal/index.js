import React from 'react';

import useSnapshotFormModal from './useSnapshotFormModal';
import SnapshotFormModal from './SnapshotFormModal';

const WrappedSnapshotFormModal = props => {
  const { setModalClosed } = useSnapshotFormModal();

  return <SnapshotFormModal setModalClosed={setModalClosed} {...props} />;
};

export default WrappedSnapshotFormModal;
