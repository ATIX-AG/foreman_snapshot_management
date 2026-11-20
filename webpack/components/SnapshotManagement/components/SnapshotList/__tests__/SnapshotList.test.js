import React from 'react';
import { render, screen } from '@testing-library/react';

import SnapshotList from '../SnapshotList';

const funcDummies = {
  loadSnapshots: hostId => null,
  deleteAction: hostId => null,
  rollbackAction: hostId => null,
  updateAction: hostId => null,
};
const host = {
  id: 42,
  name: 'deep.thought',
};
const testSnapshots = [
  {
    id: 'snapshot-15776',
    name: 'test',
    description: '123 testSnapshot',
    created_at: '2021-01-19 15:03:47 UTC',
  },
  {
    id: 'snapshot-17285',
    name: 'Hello',
    description: 'World\nHow are you?',
    created_at: '2021-04-28 10:22:06 UTC',
  },
];
const permissions = { canUpdate: true, canRevert: true, canDelete: true };
const renderList = props =>
  render(
    <SnapshotList host={host} isLoading={false} {...funcDummies} {...props} />
  );

describe('SnapshotList', () => {
  it('renders without optional props', () => {
    renderList();
    expect(screen.queryByText('test')).not.toBeInTheDocument();
  });

  it('renders loading state', () => {
    renderList({ isLoading: true });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders working state', () => {
    renderList({ isWorking: true, snapshots: testSnapshots });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error', () => {
    renderList({ hasError: true, error: { message: 'TEST' } });
    expect(screen.getByText(/TEST/)).toBeInTheDocument();
  });

  it('renders the snapshot list', () => {
    renderList({ snapshots: testSnapshots, ...permissions });
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('123 testSnapshot')).toBeInTheDocument();
  });

  it('renders without any permissions', () => {
    renderList({
      snapshots: testSnapshots,
      canUpdate: false,
      canRevert: false,
      canDelete: false,
    });
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('renders without delete permission', () => {
    renderList({ snapshots: testSnapshots, ...permissions, canDelete: false });
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('renders without editableSnapshotName capability', () => {
    renderList({
      snapshots: testSnapshots,
      ...permissions,
      capabilities: { editableSnapshotName: false },
    });
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
