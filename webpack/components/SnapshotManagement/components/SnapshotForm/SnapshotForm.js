import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { translate as __ } from 'foremanReact/common/I18n';
// import CheckBox from 'foremanReact/components/common/forms/Checkbox';
// import TextInput from 'foremanReact/components/common/forms/TextInput';
import ForemanForm from 'foremanReact/components/common/forms/ForemanForm';
import TextField from 'foremanReact/components/common/forms/TextField';

import { SNAPSHOT_CREATE_URL } from './SnapshotFormConstants';
import './snapshotForm.scss';

const SnapshotForm = ({
  hostId,
  initialValues,
  submitForm,
  capabilities,
  ...props
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
  });

  const handleSubmit = async (values, actions) => {
    const submitValues = {
      include_ram: values.includeRam || false,
      snapshot: {
        name: values.name,
        description: values.description || '',
      },
    };

    await submitForm({
      item: 'Snapshot',
      url: SNAPSHOT_CREATE_URL.replace(':hostId', hostId),
      values: submitValues,
      message: __('Snapshot successfully created!'),
    });
    actions.setSubmitting(false);
    props.setModalClosed();
  };

  return (
    <ForemanForm
      onSubmit={(values, actions) => handleSubmit(values, actions)}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onCancel={() => props.setModalClosed()}
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
      <TextField
        type="checkbox"
        name="includeRam"
        label={__('Include RAM')}
        inputClassName="col-md-8"
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
  }),
  submitForm: PropTypes.func.isRequired,
  setModalClosed: PropTypes.func,
  capabilities: PropTypes.shape({
    limitSnapshotNameFormat: PropTypes.bool,
  }),
};

SnapshotForm.defaultProps = {
  className: '',
  children: null,
  initialValues: {
    name: '',
    description: '',
    includeRam: false,
  },
  setModalClosed: () => {},
  capabilities: {
    limitSnapshotNameFormat: false,
  },
};

export default SnapshotForm;
