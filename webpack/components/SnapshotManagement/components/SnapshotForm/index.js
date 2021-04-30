import React from 'react';
import { useDispatch } from 'react-redux';

import { submitForm } from 'foremanReact/redux/actions/common/forms';

import SnapshotForm from './SnapshotForm';

const WrappedSnapshotForm = props => {
  const dispatch = useDispatch();

  return (
    <SnapshotForm
      submitForm={(...args) => dispatch(submitForm(...args))}
      {...props}
    />
  );
};

export default WrappedSnapshotForm;
