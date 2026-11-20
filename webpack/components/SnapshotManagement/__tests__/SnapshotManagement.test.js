import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SnapshotManagement from '../SnapshotManagement';

const mockSetModalOpen = jest.fn();

jest.mock('../components/SnapshotFormModal', () => () => (
  <div data-testid="form-modal" />
));
jest.mock('../components/SnapshotFormModal/useSnapshotFormModal', () => ({
  __esModule: true,
  default: () => ({ setModalOpen: mockSetModalOpen }),
}));
jest.mock('../components/SnapshotList/SnapshotList', () => () => (
  <div data-testid="snapshot-list" />
));

const host = { id: 42, name: 'deep.thought', ignored: 'x' };

describe('SnapshotManagement', () => {
  it('renders only the list without create permission', () => {
    render(<SnapshotManagement host={host} onSubmit={jest.fn()} />);
    expect(screen.getByTestId('snapshot-list')).toBeInTheDocument();
    expect(screen.queryByTestId('form-modal')).not.toBeInTheDocument();
  });

  it('opens the modal from the create button', () => {
    render(<SnapshotManagement host={host} canCreate onSubmit={jest.fn()} />);
    expect(screen.getByTestId('form-modal')).toBeInTheDocument();
    userEvent.click(screen.getByText('Create Snapshot'));
    expect(mockSetModalOpen).toHaveBeenCalled();
  });
});
