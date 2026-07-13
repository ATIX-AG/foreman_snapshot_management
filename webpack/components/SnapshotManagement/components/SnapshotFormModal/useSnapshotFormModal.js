import { useBulkModalOpen } from 'foremanReact/common/BulkModalStateHelper';

import { SNAPSHOT_FORM_MODAL } from './SnapshotFormModalConstants';

const useSnapshotFormModal = () => {
  const { isOpen, open, close, toggle } = useBulkModalOpen(SNAPSHOT_FORM_MODAL);

  return {
    isOpen,
    setModalOpen: open,
    setModalClosed: close,
    toggleModal: toggle,
  };
};

export default useSnapshotFormModal;
