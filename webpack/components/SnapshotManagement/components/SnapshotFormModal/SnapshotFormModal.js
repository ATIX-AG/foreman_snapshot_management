import React from 'react';
import PropTypes from 'prop-types';
import { Title, Text, TextContent } from '@patternfly/react-core';
import ForemanModal from 'foremanReact/components/ForemanModal';
import { translate as __, sprintf } from 'foremanReact/common/I18n';
import SnapshotForm from '../SnapshotForm';
import { SNAPSHOT_FORM_MODAL } from './SnapshotFormModalConstants';

const SnapshotFormModal = ({
  selectedHosts,
  selectedHostsCount,
  setModalClosed,
  host,
  ...props
}) => {
  const displayCount = selectedHostsCount === 0 ? 1 : selectedHostsCount;
  const hasSelection = selectedHostsCount > 0 || host;

  return (
    <ForemanModal
      id={SNAPSHOT_FORM_MODAL}
      enforceFocus
      ouiaId="snapshot-form-modal"
    >
      <ForemanModal.Header closeButton={false}>
        <TextContent className="pf-v5-u-mb-md">
          <Title headingLevel="h1" size="3xl" ouiaId="snapshot-modal-title">
            {__('Create snapshot')}
          </Title>

          {hasSelection && (
            <Text
              component="small"
              className="pf-v5-u-color-200 pf-v5-u-font-size-sm pf-v5-u-mt-sm"
              ouiaId="snapshot-modal-hosts-count"
            >
              {sprintf(
                displayCount === 1
                  ? __('%s host is selected for snapshot creation')
                  : __('%s hosts are selected for snapshot creation'),
                displayCount
              )}
            </Text>
          )}
        </TextContent>
      </ForemanModal.Header>

      {hasSelection && (
        <SnapshotForm
          setModalClosed={setModalClosed}
          selectedHosts={selectedHosts}
          host={host}
          {...props}
        />
      )}
    </ForemanModal>
  );
};

SnapshotFormModal.propTypes = {
  selectedHosts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      capabilities: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  selectedHostsCount: PropTypes.number,
  setModalClosed: PropTypes.func.isRequired,
  host: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    capabilities: PropTypes.shape({
      editableSnapshotName: PropTypes.bool,
      limitSnapshotNameFormat: PropTypes.bool,
      quiesceOption: PropTypes.bool,
    }),
  }),
};

SnapshotFormModal.defaultProps = {
  selectedHosts: [],
  selectedHostsCount: 0,
  host: null,
};

export default SnapshotFormModal;
