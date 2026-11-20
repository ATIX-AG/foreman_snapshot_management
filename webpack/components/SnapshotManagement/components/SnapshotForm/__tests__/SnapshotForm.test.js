import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SnapshotForm from '../SnapshotForm';

const fetchBulkParams = () => 'bulk search';
const baseProps = { hostId: 42, onSubmit: jest.fn(), fetchBulkParams };

describe('SnapshotForm', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the form fields', () => {
    render(<SnapshotForm {...baseProps} />);
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
    expect(screen.getAllByRole('textbox')[1]).toBeInTheDocument();
    expect(screen.getByText('Select snapshot mode')).toBeInTheDocument();
  });

  it('renders with initial values', () => {
    render(
      <SnapshotForm
        {...baseProps}
        initialValues={{
          name: 'Snapshot1',
          description: 'Hello World',
          includeRam: true,
        }}
      />
    );
    expect(screen.getAllByRole('textbox')[0]).toHaveValue('Snapshot1');
    expect(screen.getAllByRole('textbox')[1]).toHaveValue('Hello World');
  });

  it('validates the name with limitSnapshotNameFormat capability', async () => {
    render(
      <SnapshotForm
        {...baseProps}
        capabilities={{ limitSnapshotNameFormat: true }}
      />
    );
    const input = screen.getAllByRole('textbox')[0];
    userEvent.type(input, '1');
    userEvent.tab();
    expect(
      await screen.findByText(
        /Name must contain at least 2 characters|Too Short/
      )
    ).toBeInTheDocument();
  });

  it('submits a single host snapshot', async () => {
    const onSubmit = jest.fn();
    const setModalClosed = jest.fn();
    render(
      <SnapshotForm
        {...baseProps}
        host={{ id: 42, name: 'deep.thought' }}
        onSubmit={onSubmit}
        setModalClosed={setModalClosed}
        initialValues={{
          name: 'Snap',
          description: 'desc',
          includeRam: false,
        }}
      />
    );
    userEvent.click(screen.getByRole('button', { name: /submit|create/i }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      mode: 'full',
      hostId: 42,
      included: { search: 'id = 42' },
      snapshot: { name: 'Snap', description: 'desc' },
    });
    await waitFor(() => expect(setModalClosed).toHaveBeenCalled());
  });
});
