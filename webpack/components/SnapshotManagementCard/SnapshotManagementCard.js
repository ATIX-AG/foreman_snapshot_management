import PropTypes from 'prop-types';
import React from 'react';

import CardTemplate from 'foremanReact/components/HostDetails/Templates/CardItem/CardTemplate';
import { translate as __ } from 'foremanReact/common/I18n';

import SnapshotManagement from '../SnapshotManagement';
import useSnapshotSubmit from '../SnapshotManagement/components/hooks/useSnapshotSubmit';

const SnapshotManagementCard = ({ hostDetails, ...props }) => {
  const children = [];
  const { handleSubmit } = useSnapshotSubmit();

  const snapshotsEnabled =
    hostDetails?.capabilities?.includes('snapshots') || false;
  const capabilities = {
    editableSnapshotName:
      hostDetails?.capabilities?.includes('editable_snapshot_name') || false,
    limitSnapshotNameFormat:
      hostDetails?.capabilities?.includes('limit_snapshot_name_format') ||
      false,
    quiesceOption:
      hostDetails?.capabilities?.includes('snapshot_include_quiesce') || false,
  };

  if (
    snapshotsEnabled &&
    hostDetails?.uuid &&
    hostDetails?.id &&
    hostDetails?.permissions
  ) {
    children.push(
      <SnapshotManagement
        key="SnapshotManagement"
        host={{ id: hostDetails.id, name: hostDetails.name }}
        canCreate={hostDetails.permissions.create_snapshots}
        canUpdate={hostDetails.permissions.edit_snapshots}
        canRevert={hostDetails.permissions.revert_snapshots}
        canDelete={hostDetails.permissions.destroy_snapshots}
        hostCapabilities={capabilities}
        onSubmit={handleSubmit}
      />
    );
    return (
      <CardTemplate
        overrideGridProps={{ xl2: 6, xl: 8, lg: 8, md: 12 }}
        header={__('Snapshots')}
      >
        {children}
      </CardTemplate>
    );
  }
  return null;
};

export default SnapshotManagementCard;

SnapshotManagementCard.propTypes = {
  hostDetails: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    uuid: PropTypes.string,
    capabilities: PropTypes.array,
    permissions: PropTypes.shape({
      create_snapshots: PropTypes.bool,
      edit_snapshots: PropTypes.bool,
      revert_snapshots: PropTypes.bool,
      destroy_snapshots: PropTypes.bool,
    }),
  }),
};

SnapshotManagementCard.defaultProps = {
  hostDetails: {},
};
