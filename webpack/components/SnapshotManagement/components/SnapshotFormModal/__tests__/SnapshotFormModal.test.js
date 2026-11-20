import React from 'react';
import { render, screen } from '@testing-library/react';

import SnapshotFormModal from '../SnapshotFormModal';

const setModalClosed = () => null;
const fetchBulkParams = () => null;
const fixtures = {
  normal: {
    isOpen: true,
    host: { id: 42, name: 'deep.thought' },
    setModalClosed,
    fetchBulkParams,
    onSubmit: () => null,
  },
};

describe('SnapshotFormModal', () => {
  it('renders the modal with the host count', () => {
    render(<SnapshotFormModal {...fixtures.normal} />);
    expect(screen.getByText('Create snapshot')).toBeInTheDocument();
    expect(
      screen.getByText('1 host is selected for snapshot creation')
    ).toBeInTheDocument();
  });

  it('renders nothing when closed', () => {
    render(<SnapshotFormModal {...fixtures.normal} isOpen={false} />);
    expect(screen.queryByText('Create snapshot')).not.toBeInTheDocument();
  });

  it('renders plural count for multiple hosts', () => {
    render(
      <SnapshotFormModal
        {...fixtures.normal}
        host={null}
        selectedHostsCount={3}
        selectedHosts={[{ id: 1, name: 'a' }]}
      />
    );
    expect(
      screen.getByText('3 hosts are selected for snapshot creation')
    ).toBeInTheDocument();
  });

  it('hides the form without selection', () => {
    render(<SnapshotFormModal {...fixtures.normal} host={null} />);
    expect(
      screen.queryByText(/selected for snapshot creation/)
    ).not.toBeInTheDocument();
  });
});
