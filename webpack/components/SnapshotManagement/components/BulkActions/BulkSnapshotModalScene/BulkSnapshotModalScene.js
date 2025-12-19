import React, { useContext } from 'react';
import { ForemanActionsBarContext } from 'foremanReact/components/HostDetails/ActionsBar';
import WrappedSnapshotFormModal from '../../SnapshotFormModal';
import useSnapshotSubmit from '../../hooks/useSnapshotSubmit';

const BulkSnapshotModalScene = () => {
  const { selectedResults = [], selectedCount = 0 } =
    useContext(ForemanActionsBarContext) || {};
  const { handleSubmit } = useSnapshotSubmit();

  return (
    <WrappedSnapshotFormModal
      selectedHosts={selectedResults}
      selectedHostsCount={selectedCount}
      onSubmit={handleSubmit}
    />
  );
};

export default BulkSnapshotModalScene;
