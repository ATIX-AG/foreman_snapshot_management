import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextArea,
  TextInput,
} from '@patternfly/react-core';

const SnapshotFormField = ({ name, label, type, required, ouiaId }) => (
  <Field name={name}>
    {({ field, form }) => {
      const error = form.touched[name] && form.errors[name];
      const Input = type === 'textarea' ? TextArea : TextInput;
      return (
        <FormGroup
          label={label}
          isRequired={required}
          fieldId={`snapshot-form-${name}`}
        >
          <Input
            id={`snapshot-form-${name}`}
            name={field.name}
            value={field.value || ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            validated={error ? 'error' : 'default'}
            className="pf-v5-u-w-90"
            {...(type === 'textarea'
              ? { resizeOrientation: 'vertical' }
              : { type, ouiaId })}
          />
          {error && (
            <FormHelperText>
              <HelperText>
                <HelperTextItem variant="error">{error}</HelperTextItem>
              </HelperText>
            </FormHelperText>
          )}
        </FormGroup>
      );
    }}
  </Field>
);

SnapshotFormField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  required: PropTypes.bool,
  ouiaId: PropTypes.string.isRequired,
};

SnapshotFormField.defaultProps = {
  type: 'text',
  required: false,
};

export default SnapshotFormField;
