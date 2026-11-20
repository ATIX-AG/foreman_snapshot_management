import * as Yup from 'yup';

import { translate as __ } from 'foremanReact/common/I18n';

const MAX_SNAPSHOT_NAME_LENGTH = 80;
const LIMITED_MAX_SNAPSHOT_NAME_LENGTH = 40;

export const buildValidationSchema = capabilities => {
  let nameValidation = Yup.string().max(MAX_SNAPSHOT_NAME_LENGTH, 'Too Long!');
  if (capabilities.limitSnapshotNameFormat)
    nameValidation = nameValidation
      .min(2, 'Too Short!')
      .matches(
        /^[A-z]\w+$/,
        __(
          'Name must contain at least 2 characters starting with alphabet. Valid characters are A-Z a-z 0-9 _'
        )
      )
      .max(LIMITED_MAX_SNAPSHOT_NAME_LENGTH, 'Too Long!');

  return Yup.object().shape({
    name: nameValidation.required('is required'),
    description: Yup.string(),
    includeRam: Yup.bool(),
    useQuiesce: Yup.bool(),
    snapshotMode: Yup.string(),
  });
};

export const buildSnapshotPayload = (
  values,
  snapshotMode,
  host,
  fetchBulkParams
) => {
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

  const singleHostId = host?.id;

  return {
    included: {
      search: host ? `id = ${singleHostId}` : fetchBulkParams(),
    },
    ...(singleHostId && { hostId: singleHostId }),
    mode,
    snapshot: {
      name: values.name,
      description: values.description || '',
    },
  };
};
