import { useForemanModal } from 'foremanReact/components/ForemanModal/ForemanModalHooks';

import { SNAPSHOT_FORM_MODAL } from './SnapshotFormModalConstants';

const useSnapshotFormModal = () => useForemanModal({ id: SNAPSHOT_FORM_MODAL });

export default useSnapshotFormModal;
