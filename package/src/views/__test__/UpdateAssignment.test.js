import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import UpdateAssignment from '../UpdateAssignment';

jest.mock('axios');

describe('UpdateAssignment', () => {
  test('renders with correct title', async () => {
    const mockedAssignmentData = {
      homework_title: 'Namų darbas',
      from_date: '2024-04-10',
      to_date: '2024-04-15',
      classs: '8A'
    };
    axios.get.mockResolvedValueOnce({ data: mockedAssignmentData });

    render(<BrowserRouter><UpdateAssignment /></BrowserRouter>);

    expect(await screen.findByText('Namų darbas')).toBeInTheDocument();
  });

  test('saves assignment with valid data', async () => {
    const mockedAssignmentData = {
      homework_title: 'Namų darbas',
      from_date: '2024-04-10',
      to_date: '2024-04-15',
      classs: '8A'
    };
    axios.get.mockResolvedValueOnce({ data: mockedAssignmentData });
    axios.put.mockResolvedValueOnce({ status: 200 });

    render(<BrowserRouter><UpdateAssignment /></BrowserRouter>);

    const saveButton = screen.getByText('Išsaugoti');

    fireEvent.click(saveButton);

    expect(await screen.findByText('Operacija sėkminga!')).toBeInTheDocument();
  });

  test('displays error message when saving with invalid date range', async () => {
    const mockedAssignmentData = {
      homework_title: 'Namų darbas',
      from_date: '2024-04-15',
      to_date: '2024-04-10',
      classs: '8A'
    };
    axios.get.mockResolvedValueOnce({ data: mockedAssignmentData });

    render(<BrowserRouter><UpdateAssignment /></BrowserRouter>);

    const saveButton = screen.getByText('Išsaugoti');

    fireEvent.click(saveButton);

    expect(await screen.findByText('Klaida!')).toBeInTheDocument();
  });
});
