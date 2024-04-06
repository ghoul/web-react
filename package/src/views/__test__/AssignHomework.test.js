import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import AssignHomework from '../AssignHomework';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

describe('AssignHomework component', () => {
  test('submits assignment form with valid data', async () => {
    axios.post.mockResolvedValueOnce({ status: 201 });
    render(<Router><AssignHomework /></Router>);

    fireEvent.change(screen.getByLabelText('Pradžios data'), { target: { value: '2024-04-07' } });
    fireEvent.change(screen.getByLabelText('Pabaigos data'), { target: { value: '2024-04-14' } });
    fireEvent.change(screen.getByLabelText('Klasė'), { target: { value: '1' } });

    fireEvent.click(screen.getByText('Paskirti'));
    await expect(axios.post).toHaveBeenCalled();
  });

  test('displays error message for invalid form data', async () => {
    render(<Router><AssignHomework /></Router>);

    fireEvent.change(screen.getByLabelText('Pradžios data'), { target: { value: '2024-04-14' } });
    fireEvent.change(screen.getByLabelText('Pabaigos data'), { target: { value: '2024-04-07' } });
    fireEvent.change(screen.getByLabelText('Klasė'), { target: { value: '1' } });

    fireEvent.click(screen.getByText('Paskirti'));
    await expect(screen.getByText('Klaida! Pradžios data turi būti ankstesnė nei pabaigos data.')).toBeInTheDocument();
  });

});
