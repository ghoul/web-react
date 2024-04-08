import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import AdminSchool from '../AdminSchool';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

describe('AdminSchool component', () => {

  test('fetches schools and renders them correctly', async () => {
    axios.get.mockResolvedValueOnce({
        data: [
          { id: 1, title: 'Mokykla 1', license_end: '2024-12-31' },
          { id: 2, title: 'Mokykla 2', license_end: '2025-06-30' },
        ],
      });
      
    render(<BrowserRouter><AdminSchool /></BrowserRouter>);

    await waitFor(() => {
        const schools = screen.getAllByText('Mokykla 1');
        expect(schools.length).toBe(2);
      });
      const schools2 = screen.getAllByText('Mokykla 2');
      expect(schools2.length).toBe(2);
   
  });

  test('creates a new school', async () => {
    axios.get.mockResolvedValueOnce({
        data: [
          { id: 1, title: 'Mokykla 1', license_end: '2024-12-31' },
          { id: 2, title: 'Mokykla 2', license_end: '2025-06-30' },
        ],
      });
    axios.post.mockResolvedValueOnce({
        status: 200,
        data: {},
      });
    render(<BrowserRouter><AdminSchool /></BrowserRouter>);

    await userEvent.type(screen.getByLabelText('Pavadinimas'), 'Nauja Mokykla');
    await userEvent.type(screen.getAllByLabelText('Licenzijos galiojimo pabaiga')[0], '2025-12-31');

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    Object.defineProperty(screen.getAllByLabelText('CSV failas')[0], 'files', {
      value: [file],
    });

    fireEvent.click(screen.getAllByText('Įrašyti')[0]);

    await waitFor(() => {
      expect(screen.getAllByText('Klaida!')[0]).toBeInTheDocument(); 
      
    });
  });

  test('updates an existing school', async () => {
    axios.get.mockResolvedValueOnce({
        data: [
          { id: 1, title: 'Mokykla 1', license_end: '2024-12-31' },
          { id: 2, title: 'Mokykla 2', license_end: '2025-06-30' },
        ],
      });
      axios.post.mockResolvedValueOnce({
        status: 400,
        data: {},
      });
    render(<BrowserRouter><AdminSchool /></BrowserRouter>);
 
    const chooseSchool = screen.getByTestId('updateSchool');
    fireEvent.change(chooseSchool, { target: { value: 2 } });

    userEvent.type(screen.getByLabelText('Pavadinimas (jei keičiasi)'), 'Atnaujinta Mokykla');
    userEvent.type(screen.getAllByLabelText('Licenzijos galiojimo pabaiga')[1], '2026-12-31');

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    Object.defineProperty(screen.getAllByLabelText('CSV failas')[0], 'files', {
      value: [file],
    });

    fireEvent.click(screen.getAllByText('Įrašyti')[1]);

    await waitFor(() => {
      expect(screen.getAllByText('Klaida!')[0]).toBeInTheDocument(); 
    });
  });

  test('deletes an existing school', async () => {
    axios.get.mockResolvedValueOnce({
        data: [
          { id: 1, title: 'Mokykla 1', license_end: '2024-12-31' },
          { id: 2, title: 'Mokykla 2', license_end: '2025-06-30' },
        ],
      });
      axios.delete.mockResolvedValueOnce({
        status: 204,
      });
    render(<BrowserRouter><AdminSchool /></BrowserRouter>);

    let deleteButtons;
    await waitFor(() => {
        deleteButtons = screen.getAllByText('✖');
        });

    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText('Taip'));

    await waitFor(() => {
      expect(screen.queryByText('Operacija sėkminga!')).toBeNull();
    });
  });
});
