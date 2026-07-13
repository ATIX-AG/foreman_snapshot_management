import React from 'react';
import useSnapshotFormModal from './useSnapshotFormModal';
import SnapshotFormModal from './SnapshotFormModal';

const WrappedSnapshotFormModal = props => {
  const { isOpen, setModalClosed } = useSnapshotFormModal();

  return (
    <SnapshotFormModal
      isOpen={isOpen}
      setModalClosed={setModalClosed}
      {...props}
    />
  );
};

export default WrappedSnapshotFormModal;
