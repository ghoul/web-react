import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import AssignHomework from '../AssignHomework';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

describe('AssignHomework component', () => {

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [{ id: 1, title: '8A' }] });
  });
  test('submits assignment form with valid data', async () => {
    axios.post.mockResolvedValueOnce({ status: 201 });
    render(<Router><AssignHomework /></Router>);

    fireEvent.change(screen.getByLabelText('Pradžios data'), { target: { value: '2024-04-07' } });
    fireEvent.change(screen.getByLabelText('Pabaigos data'), { target: { value: '2024-04-14' } });
    fireEvent.change(screen.getByLabelText('Klasė'), { target: { value: '1' } });

    fireEvent.click(screen.getByText('Paskirti'));
    await expect(axios.post).toHaveBeenCalled();
  });

  test('displays error message for invalid form data date', async () => {
    render(<Router><AssignHomework /></Router>);

    fireEvent.change(screen.getByLabelText('Pradžios data'), { target: { value: '2024-04-14' } });
    fireEvent.change(screen.getByLabelText('Pabaigos data'), { target: { value: '2024-04-07' } });
    fireEvent.change(screen.getByLabelText('Klasė'), { target: { value: '1' } });

    fireEvent.click(screen.getByText('Paskirti'));
    await expect(screen.getByText('Klaida! Pradžios data turi būti ankstesnė nei pabaigos data.')).toBeInTheDocument();
  });


  test('displays success message for valid form data', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: '1', title: '8A' },
        { id: '2', title: '8B' },
      ]
    });
    axios.post.mockResolvedValueOnce({ status: 201 });
    render(<Router><AssignHomework /></Router>);

    await waitFor(() => {
      screen.getByLabelText('Pradžios data');
    });

    fireEvent.change(screen.getByLabelText('Pradžios data'), { target: { value: '2024-04-14' } });
    fireEvent.change(screen.getByLabelText('Pabaigos data'), { target: { value: '2024-04-28' } });
    fireEvent.change(screen.getByLabelText('Klasė'), { target: { value: '1' } });

    await waitFor(() => {
      screen.getByText('Paskirti');
    });
    fireEvent.click(screen.getByText('Paskirti'));

    await waitFor(() => {
      expect(screen.getByText('Operacija sėkminga!')).toBeInTheDocument();
    });
    
  });


  test('displays error message for invalid form data error', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: '1', title: '8A' },
        { id: '2', title: '8B' },
      ]
    });
    axios.post.mockRejectedValue({ response: { data: { error: 'Nepavyko paskirti namų darbo' } } });
    render(<Router><AssignHomework /></Router>);

    await waitFor(() => {
      screen.getByLabelText('Pradžios data');
    });

    fireEvent.change(screen.getByLabelText('Pradžios data'), { target: { value: '2024-04-14' } });
    fireEvent.change(screen.getByLabelText('Pabaigos data'), { target: { value: '2024-04-28' } });
    fireEvent.change(screen.getByLabelText('Klasė'), { target: { value: '1' } });

    await waitFor(() => {
      screen.getByText('Paskirti');
    });
    fireEvent.click(screen.getByText('Paskirti'));
    
    await waitFor(() => {
      expect(screen.getByText('Klaida! Nepavyko paskirti namų darbo')).toBeInTheDocument();
    });
  });

});
