import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { translate as __ } from 'foremanReact/common/I18n';
import ForemanForm from 'foremanReact/components/common/forms/ForemanForm';
import TextField from 'foremanReact/components/common/forms/TextField';
import Select from 'foremanReact/components/common/forms/Select';
import { FieldLevelHelp } from 'patternfly-react';
import { SNAPSHOT_CREATE_URL } from './SnapshotFormConstants';
import './snapshotForm.scss';

const SnapshotForm = ({
  hostId,
  initialValues,
  submitForm,
  capabilities,
  ...props
}) => {
  const { setModalClosed } = props;
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

  const [snapshotMode, setSnapshotMode] = useState();

  const options = {'Memory': __('Memory')};
  if (capabilities.quiesceOption) {
    options.Quiesce = __('Quiesce');
  }

  const handleSubmit = (values, actions) => {
    if (snapshotMode === 'Quiesce') {
      values.useQuiesce = true, values.includeRam = false; }
    else if (snapshotMode === 'Memory') {
      values.includeRam = true, values.useQuiesce = false; }

    const submitValues = {
      include_ram: values.includeRam || false,
      quiesce: values.useQuiesce || false,
      snapshot: {
        name: values.name,
        description: values.description || '',
      },
    };
    submitForm({
      item: 'Snapshot',
      url: SNAPSHOT_CREATE_URL.replace(':hostId', hostId),
      values: submitValues,
      message: __('Snapshot successfully created!'),
      successCallback: setModalClosed,
      actions,
    });
  };

  return (
    <ForemanForm
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onCancel={setModalClosed}
    >
      <TextField
        name="name"
        type="text"
        required="true"
        label={__('Name')}
        inputClassName="col-md-8"
      />
      <TextField
        name="description"
        type="textarea"
        label={__('Description')}
        inputClassName="col-md-8"
      />
      <Select
        label={
          <span>
            {__('Snapshot Mode')}
            <FieldLevelHelp
              buttonClass="field-help"
              placement="top"
              content={
                       __("Select Snapshot Mode between mutually exclusive options, 'Memory' (includes RAM) and 'Quiesce'.")
                      }
            />
          </span>}
        value={snapshotMode}
        disabled={false}
        options={options}
        onChange={e => setSnapshotMode(e.target.value)}
        useSelect2={false}
      />
    </ForemanForm>
  );
};

SnapshotForm.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  hostId: PropTypes.number.isRequired,
  initialValues: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    includeRam: PropTypes.bool.isRequired,
    useQuiesce: PropTypes.bool,
  }),
  submitForm: PropTypes.func.isRequired,
  setModalClosed: PropTypes.func,
  capabilities: PropTypes.shape({
    limitSnapshotNameFormat: PropTypes.bool,
    quiesceOption: PropTypes.bool,
  }),
};

SnapshotForm.defaultProps = {
  className: '',
  children: null,
  initialValues: {
    name: '',
    description: '',
    includeRam: false,
    useQuiesce: false,
    snapshotMode: '',
  },
  setModalClosed: () => {},
  capabilities: {
    limitSnapshotNameFormat: false,
    quiesceOption: false,
  },
};

export default SnapshotForm;
