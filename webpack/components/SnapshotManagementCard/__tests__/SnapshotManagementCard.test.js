import React from 'react';
import { render } from '@testing-library/react';

import SnapshotManagementCard from '../SnapshotManagementCard';

jest.mock('../../SnapshotManagement', () => () => (
  <div data-testid="snapshot-management" />
));

jest.mock(
  '../../SnapshotManagement/components/hooks/useSnapshotSubmit',
  () => ({
    __esModule: true,
    default: jest.fn(() => ({
      handleSubmit: jest.fn(),
    })),
  })
);

const hostDetails = {
  id: 42,
  name: 'deep.thought',
  uuid: '829aa26a-928f-11ee-b9d1-0242ac120002',
  permissions: {
    create_snapshots: true,
    edit_snapshots: false,
    revert_snapshots: true,
    destroy_snapshots: false,
  },
  capabilities: ['snapshots'],
};

const hostDetailsVmware = {
  ...hostDetails,
  capabilities: [
    'build',
    'image',
    'snapshots',
    'snapshot_include_quiesce',
    'snapshot_include_ram',
    'editable_snapshot_name',
  ],
};
const hostDetailsProxmox = {
  ...hostDetails,
  capabilities: [
    'build',
    'new_volume',
    'new_interface',
    'image',
    'snapshots',
    'limit_snapshot_name_format',
  ],
};
const hostDetailsNotSupported = {
  ...hostDetails,
  capabilities: ['build', 'new_volume', 'new_interface', 'image'],
};

describe('SnapshotManagementCard', () => {
  it('renders nothing without optional props', () => {
    const { container } = render(<SnapshotManagementCard />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing with NotSupported CR capabilities', () => {
    const { container } = render(
      <SnapshotManagementCard hostDetails={hostDetailsNotSupported} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it.each([
    ['basic props', hostDetails],
    ['VMWare capabilities', hostDetailsVmware],
    ['Proxmox capabilities', hostDetailsProxmox],
  ])('renders the card with %s', (_name, details) => {
    const { getByTestId } = render(
      <SnapshotManagementCard hostDetails={details} />
    );
    expect(getByTestId('snapshot-management')).toBeInTheDocument();
  });
});
