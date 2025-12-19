import { useDispatch } from 'react-redux';
import { bulkCreateSnapshotsAction } from '../../SnapshotManagementActions';

const useSnapshotSubmit = () => {
  const dispatch = useDispatch();

  const handleSubmit = async formValues =>
    dispatch(bulkCreateSnapshotsAction(formValues));

  return { handleSubmit };
};

export default useSnapshotSubmit;
