import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Starter from '../Starter';
import Cookies from 'js-cookie';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

describe('Starter component', () => {
    let mockData;
    let studentMockData;
  beforeEach(() => {
    
    Cookies.set('token', 'token');
    Cookies.set('csrftoken', 'csrftoken');

      mockData = [
      {
        id: 1,
        homework_title: 'Namų darbas 1',
        from_date: '2024-04-01',
        to_date: '2024-04-10',
        classs_title: '8A',
        status: 'Good',
      },
      {
        id: 2,
        homework_title: 'Namų darbas 2',
        from_date: '2024-04-05',
        to_date: '2024-04-15',
        classs_title: '8B',
        status: 'Average',
      },
    ];

    studentMockData = [
        {
          id: 1,
          homework_title: 'Namų darbas 1',
          from_date: '2024-04-01',
          to_date: '2024-04-10',
          teacher_first_name: 'Mokytoja',
          teacher_last_name: 'Mokytojauskiene',
        }
      ];

    
  });

  test('renders Starter component with correct title for teacher', async () => {
    const mockUser = { id: 1, role: 2 };
    Cookies.set('user', JSON.stringify(mockUser));
    axios.get.mockResolvedValueOnce({ data: mockData });

    render(<BrowserRouter><Starter /></BrowserRouter>);
    
    await waitFor(() => {
      expect(screen.getByText('Aktyvūs namų darbai')).toBeInTheDocument();
    });
    expect(screen.getByText('Keisti')).toBeInTheDocument();
  });

  test('renders Starter component with correct title for student', async () => {
    const mockUser = { id: 1, role: 1 };
    Cookies.set('user', JSON.stringify(mockUser));
    axios.get.mockResolvedValueOnce({ data: mockData });

    render(<BrowserRouter><Starter /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('Aktyvūs namų darbai')).toBeInTheDocument();
      
    });
    expect(screen.getByText('Žaisti')).toBeInTheDocument();
  });

  test('renders list of assignments for teacher', async () => {
    const mockUser = { id: 1, role: 2 };
    Cookies.set('user', JSON.stringify(mockUser));
    axios.get.mockResolvedValueOnce({ data: mockData });

    render(<BrowserRouter><Starter /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('Namų darbas 1')).toBeInTheDocument();
    });
      expect(screen.getByText('Namų darbas 2')).toBeInTheDocument();
    
  });

  test('renders list of assignments for student', async () => {
    const mockUser = { id: 1, role: 1 };
    Cookies.set('user', JSON.stringify(mockUser));
    axios.get.mockResolvedValueOnce({ data: mockData });

    render(<BrowserRouter><Starter /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('Namų darbas 1')).toBeInTheDocument();
    });
      expect(screen.getByText('Namų darbas 2')).toBeInTheDocument();
    
  });

  test('opens modal when delete button is clicked', async () => {
    const mockUser = { id: 1, role: 2 };
    Cookies.set('user', JSON.stringify(mockUser));
    axios.get.mockResolvedValueOnce({ data: mockData });

    var deleteButtons = [];

    render(<BrowserRouter><Starter /></BrowserRouter>);

    await waitFor(() => {
        deleteButtons = screen.getAllByText('✖');
    });
    expect(deleteButtons.length).toBeGreaterThan(0);
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Ar tikrai norite pašalinti?')).toBeInTheDocument();
    });
  });
  test('deletes when delete button is clicked', async () => {
    axios.delete.mockResolvedValueOnce({ status: 204 });
    const mockUser = { id: 1, role: 2 };
    Cookies.set('user', JSON.stringify(mockUser));
    axios.get.mockResolvedValueOnce({ data: mockData });
    var deleteButtons = [];

    render(<BrowserRouter><Starter /></BrowserRouter>);

    await waitFor(() => {
        deleteButtons = screen.getAllByText('✖');
    });
    expect(deleteButtons.length).toBeGreaterThan(0);
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText('Taip'));

    expect(axios.delete).toHaveBeenCalled();
  });

  test('redirects to game page when "Žaisti" button is clicked for student', async () => {
    const mockUser = { id: 1, role: 1 };
    Cookies.set('user', JSON.stringify(mockUser));
    axios.get.mockResolvedValueOnce({ data: studentMockData });

    const windowOpen = jest.fn();
    window.open = windowOpen;

    render(<BrowserRouter><Starter /></BrowserRouter>);
    
    await waitFor(() => {
        expect(screen.getByTestId('start-game-button')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('start-game-button'));
    
  });
});
