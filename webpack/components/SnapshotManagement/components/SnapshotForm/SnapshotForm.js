import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

import { translate as __ } from 'foremanReact/common/I18n';

import {
  Form as PfForm,
  ActionGroup,
  Button,
  Card,
  CardBody,
  FormGroup,
  Popover,
  Select,
  SelectList,
  SelectOption,
  MenuToggle,
  HelperText,
  HelperTextItem,
  Spinner,
} from '@patternfly/react-core';

import { HelpIcon } from '@patternfly/react-icons';

import SnapshotFormField from './SnapshotFormField';
import {
  buildValidationSchema,
  buildSnapshotPayload,
} from './SnapshotFormHelper';
import './snapshotForm.scss';

const SnapshotForm = ({
  initialValues,
  capabilities,
  onSubmit,
  selectedHosts,
  setModalClosed,
  fetchBulkParams,
  host,
  selectAllMode,
}) => {
  const validationSchema = buildValidationSchema(capabilities);

  const [snapshotMode, setSnapshotMode] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const singleHostSupportsQuiesce = host?.capabilities?.quiesceOption;

  const selectedHostsSupportsQuiesce =
    !selectAllMode &&
    selectedHosts?.length > 0 &&
    selectedHosts.every(h =>
      h.capabilities?.includes('snapshot_include_quiesce')
    );

  const canSupportQuiesce =
    selectAllMode || singleHostSupportsQuiesce || selectedHostsSupportsQuiesce;

  const options = [
    { label: __('Disk only'), value: 'disk_only' },
    { label: __('Include RAM'), value: 'include_ram' },
    ...(capabilities.quiesceOption
      ? [{ label: __('Quiesce'), value: 'quiesce' }]
      : []),
  ];

  const handleSubmit = async (values, actions) => {
    actions.setSubmitting(true);

    try {
      const payload = buildSnapshotPayload(
        values,
        snapshotMode,
        host,
        fetchBulkParams
      );
      await onSubmit(payload, actions);
    } catch (error) {
      if (actions.setStatus) {
        actions.setStatus(error?.message || 'Failed to create snapshot');
      }
    } finally {
      actions.setSubmitting(false);
      if (setModalClosed) setModalClosed();
    }
  };

  const selectedOptionLabel =
    options.find(opt => opt.value === snapshotMode)?.label || '';

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit: formikSubmit, isSubmitting, status }) => (
        <Card
          isCompact
          className="pf-v5-u-border pf-v5-u-border-100 pf-v5-u-rounded pf-v5-u-p-md"
          ouiaId="snapshot-form-card"
        >
          <CardBody>
            <PfForm onSubmit={formikSubmit}>
              <SnapshotFormField
                name="name"
                type="text"
                required
                label={__('Name')}
                ouiaId="snapshot-name-field"
              />

              <SnapshotFormField
                name="description"
                type="textarea"
                label={__('Description')}
                ouiaId="snapshot-description-field"
              />

              <FormGroup
                label={__('Snapshot Mode')}
                fieldId="snapshot-mode-select"
                labelIcon={
                  <Popover
                    bodyContent={__(
                      "Select Snapshot Mode between 'Disk only' (default) or mutually exclusive options, 'Memory' (includes RAM) and 'Quiesce'."
                    )}
                  >
                    <Button
                      variant="plain"
                      aria-label={__('Snapshot mode help')}
                      ouiaId="snapshot-mode-help-button"
                    >
                      <HelpIcon />
                    </Button>
                  </Popover>
                }
              >
                <div className="pf-v5-u-mt-sm">
                  <Select
                    id="snapshot-mode-select"
                    isOpen={isSelectOpen}
                    selected={snapshotMode || undefined}
                    onOpenChange={setIsSelectOpen}
                    onSelect={(_e, value) => {
                      setSnapshotMode(value);
                      setIsSelectOpen(false);
                    }}
                    ouiaId="snapshot-mode-select"
                    toggle={toggleRef => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsSelectOpen(prev => !prev)}
                        isExpanded={isSelectOpen}
                        style={{ width: '100%' }}
                        aria-label={__('Snapshot mode')}
                        ouiaId="snapshot-mode-toggle"
                      >
                        {selectedOptionLabel || __('Select snapshot mode')}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      {options.map(opt => (
                        <SelectOption
                          key={opt.value || 'empty'}
                          value={opt.value}
                          isDisabled={
                            !canSupportQuiesce && opt.value === 'quiesce'
                          }
                        >
                          {opt.label || __('Disk only')}
                        </SelectOption>
                      ))}
                    </SelectList>
                  </Select>

                  {selectAllMode && capabilities.quiesceOption && (
                    <HelperText isLiveRegion className="pf-v5-u-mt-xs">
                      <HelperTextItem variant="warning">
                        {__(
                          'Warning: In Select All mode, we cannot guarantee that all hosts support the quiesce option as the data is not available. If a host does not support quiesce, the snapshot creation may fail for that host.'
                        )}
                      </HelperTextItem>
                    </HelperText>
                  )}

                  {!canSupportQuiesce && capabilities.quiesceOption && (
                    <HelperText isLiveRegion className="pf-v5-u-mt-xs">
                      <HelperTextItem variant="error">
                        {__(
                          'Note: Not all selected hosts support quiesce. The quiesce option is disabled.'
                        )}
                      </HelperTextItem>
                    </HelperText>
                  )}
                </div>
              </FormGroup>

              {status && (
                <HelperText isLiveRegion className="pf-v5-u-mt-sm">
                  <HelperTextItem variant="error">{status}</HelperTextItem>
                </HelperText>
              )}

              <ActionGroup>
                <Button
                  type="submit"
                  variant="primary"
                  isDisabled={isSubmitting}
                  ouiaId="snapshot-form-submit"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" /> {__('Creating...')}
                    </>
                  ) : (
                    __('Create')
                  )}
                </Button>

                <Button
                  variant="link"
                  type="button"
                  onClick={setModalClosed}
                  ouiaId="snapshot-cancel-button"
                >
                  {__('Cancel')}
                </Button>
              </ActionGroup>
            </PfForm>
          </CardBody>
        </Card>
      )}
    </Formik>
  );
};

SnapshotForm.propTypes = {
  initialValues: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    includeRam: PropTypes.bool.isRequired,
    useQuiesce: PropTypes.bool,
  }),
  setModalClosed: PropTypes.func,
  capabilities: PropTypes.shape({
    limitSnapshotNameFormat: PropTypes.bool,
    quiesceOption: PropTypes.bool,
  }),
  onSubmit: PropTypes.func.isRequired,
  selectedHosts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      capabilities: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  host: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    capabilities: PropTypes.shape({
      editableSnapshotName: PropTypes.bool,
      limitSnapshotNameFormat: PropTypes.bool,
      quiesceOption: PropTypes.bool,
    }),
  }),
  fetchBulkParams: PropTypes.func.isRequired,
  selectAllMode: PropTypes.bool,
};

SnapshotForm.defaultProps = {
  initialValues: {
    name: '',
    description: '',
    includeRam: false,
    useQuiesce: false,
  },
  setModalClosed: () => {},
  capabilities: {
    limitSnapshotNameFormat: false,
    quiesceOption: true,
  },
  selectedHosts: [],
  host: null,
  selectAllMode: false,
};

export default SnapshotForm;
