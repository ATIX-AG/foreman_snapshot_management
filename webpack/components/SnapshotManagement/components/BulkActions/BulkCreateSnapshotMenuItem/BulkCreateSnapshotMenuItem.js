import React, { useContext } from 'react';
import { MenuItem } from '@patternfly/react-core';
import { ForemanHostsIndexActionsBarContext } from 'foremanReact/components/HostsIndex';
import { translate as __ } from 'foremanReact/common/I18n';

import useSnapshotFormModal from '../../SnapshotFormModal/useSnapshotFormModal';

const BulkCreateSnapshotMenuItem = () => {
  const { selectedCount = 0, setMenuOpen } =
    useContext(ForemanHostsIndexActionsBarContext) || {};
  const { setModalOpen } = useSnapshotFormModal();

  const handleClick = () => {
    setMenuOpen && setMenuOpen(false);
    setModalOpen(true);
  };

  return (
    <MenuItem
      itemId="bulk-create-snapshot"
      isDisabled={selectedCount === 0}
      onClick={handleClick}
    >
      {__('Create snapshot')}
    </MenuItem>
  );
};

export default BulkCreateSnapshotMenuItem;
