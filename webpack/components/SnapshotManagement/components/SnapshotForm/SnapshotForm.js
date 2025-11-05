import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';

import { translate as __ } from 'foremanReact/common/I18n';
import TextField from 'foremanReact/components/common/forms/TextField';
import { FieldLevelHelp } from 'patternfly-react';

import {
  Form as PfForm,
  ActionGroup,
  Button,
  Card,
  CardBody,
  Select,
  SelectList,
  SelectOption,
  MenuToggle,
  HelperText,
  HelperTextItem,
  Spinner,
} from '@patternfly/react-core';

import './snapshotForm.scss';

const SnapshotForm = ({
  initialValues,
  capabilities,
  onSubmit,
  selectedHosts,
  setModalClosed,
  host,
}) => {
  let nameValidation = Yup.string().max(80, 'Too Long!');
  if (capabilities.limitSnapshotNameFormat)
    nameValidation = nameValidation
      .min(2, 'Too Short!')
      .matches(
        /^[A-z]\w+$/,
        __(
          'Name must contain at least 2 characters starting with alphabet. Valid characters are A-Z a-z 0-9 _'
        )
      )
      .max(40, 'Too Long!');

  const validationSchema = Yup.object().shape({
    name: nameValidation.required('is required'),
    description: Yup.string(),
    includeRam: Yup.bool(),
    useQuiesce: Yup.bool(),
    snapshotMode: Yup.string(),
  });

  const [snapshotMode, setSnapshotMode] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const allSelectedSupportQuiesce =
    selectedHosts?.length > 0 &&
    selectedHosts.every(h =>
      h.capabilities?.includes('snapshot_include_quiesce')
    );

  const singleHostSupportsQuiesce = host?.capabilities?.quiesceOption;

  const canSupportQuiesce =
    allSelectedSupportQuiesce || singleHostSupportsQuiesce;

  const options = [
    { label: '', value: '' },
    { label: __('Include RAM'), value: 'include_ram' },
    ...(capabilities.quiesceOption
      ? [{ label: __('Quiesce'), value: 'quiesce' }]
      : []),
  ];

  const handleSubmit = async (values, actions) => {
    actions.setSubmitting(true);

    try {
      if (snapshotMode === 'quiesce') {
        values.useQuiesce = true;
        values.includeRam = false;
      } else if (snapshotMode === 'include_ram') {
        values.includeRam = true;
        values.useQuiesce = false;
      }

      let mode = 'full';
      if (values.includeRam) {
        mode = 'include_ram';
      } else if (values.useQuiesce) {
        mode = 'quiesce';
      }

      const submitValues = {
        mode,
        snapshot: {
          name: values.name,
          description: values.description || '',
        },
      };

      const hostsIds =
        Array.isArray(selectedHosts) && selectedHosts.length > 0
          ? selectedHosts.map(h => h.id)
          : [];

      const singleHostId = host?.id;

      let ids = [];
      if (hostsIds.length > 0) {
        ids = hostsIds;
      } else if (singleHostId) {
        ids = [singleHostId];
      }

      if (ids.length === 0) {
        actions.setSubmitting(false);
        return;
      }
      const payload = { host_ids: ids, ...submitValues };
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
            <PfForm onSubmit={formikSubmit} ouiaId="snapshot-form">
              <TextField
                name="name"
                type="text"
                required
                label={__('Name')}
                ouiaId="snapshot-name-field"
                inputClassName="pf-v5-u-w-90"
              />

              <TextField
                name="description"
                type="textarea"
                label={__('Description')}
                ouiaId="snapshot-description-field"
                inputClassName="pf-v5-u-w-90"
              />

              <div>
                <label className="pf-v5-c-form__label">
                  <span className="pf-v5-c-form__label-text">
                    {__('Snapshot Mode')}
                  </span>
                  <FieldLevelHelp
                    buttonClass="field-help"
                    placement="top"
                    content={__(
                      "Select Snapshot Mode between mutually exclusive options, 'Memory' (includes RAM) and 'Quiesce'."
                    )}
                  />
                </label>

                <div className="pf-v5-u-mt-sm">
                  <Select
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
                        isFullWidth
                        className="pf-v5-c-form-control"
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
                          {opt.label || __('None')}
                        </SelectOption>
                      ))}
                    </SelectList>
                  </Select>

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
              </div>

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
};

export default SnapshotForm;
