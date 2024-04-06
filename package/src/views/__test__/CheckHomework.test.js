import React from 'react';
import { render, waitFor,fireEvent, screen } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter, useParams } from 'react-router-dom';
import CheckHomework from '../CheckHomework';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

jest.mock('axios');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('CheckHomework component', () => {
  beforeEach(() => {
    const mockUser = { id: 1, first_name: 'Jonas', last_name: 'Jonaitis', role: 1, gender: 2 };
    Cookies.set('user', JSON.stringify(mockUser));
    Cookies.set('token', 'token');
    Cookies.set('csrftoken', 'csrftoken');

    useParams.mockReturnValue({ homeworkId: '123' });

    axios.get.mockResolvedValueOnce({
      data: {
        title: 'Namų darbas',
        pairs: [
          {
            id: 1,
            question: 'Klausimas 1',
            points: 5,
            qtype: 1,
            options: [
              { id: 1, text: 'Pasirinkimas 1' },
              { id: 2, text: 'Pasirinkimas 2' },
            ],
            correct_options: [{ id: 1 }],
          },
          {
            id: 2,
            question: 'Klausimas 2',
            points: 10,
            qtype: 2,
            options: [],
            answer: 'Atsakymas 2'
          },
        ],
        edit: true,
      },
    });
  });

  test('renders CheckHomework form', async () => {
    render(<BrowserRouter><CheckHomework /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('Namų darbas')).toBeInTheDocument();
    });
    expect(screen.getByText('1. Klausimas 1')).toBeInTheDocument();
    expect(screen.getByText('2. Klausimas 2')).toBeInTheDocument();
    expect(screen.getByText('Pasirinkimas 1')).toBeInTheDocument();
    expect(screen.getByText('Pasirinkimas 2')).toBeInTheDocument();  
  });

  test('navigates to edit page when edit button is clicked', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(<BrowserRouter><CheckHomework /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('Namų darbas')).toBeInTheDocument();
    });

    const editButton = screen.getByText('Redaguoti');
    fireEvent.click(editButton);

    expect(window.location.href).toBe(`http://localhost/edit-homework/123`);
  });
});
