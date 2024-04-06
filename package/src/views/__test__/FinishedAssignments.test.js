import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FinishedAssignments from '../FinishedAssignments';
import axios from 'axios';
import { BrowserRouter} from 'react-router-dom';
import Cookies from 'js-cookie';

// Mocking axios get method
jest.mock('axios');

describe('FinishedAssignments component', () => {
  const mockResponseData = [
    {
      id: 1,
      homework_title: 'Namų darbas',
      from_date: '2024-04-01',
      to_date: '2024-04-10',
      teacher_first_name: 'Jonas',
      teacher_last_name: 'Jonaitis',
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockResponseData });
  });

  test('renders FinishedAssignments component for student role', async () => {
    const mockUser = { id: 123, first_name: 'Jonas', last_name : 'Jonaitis', role : 1, gender : 2 };
    Cookies.set('user', JSON.stringify(mockUser));
    render(<BrowserRouter><FinishedAssignments/></BrowserRouter>);

    expect(await screen.findByText('Namų darbas')).toBeInTheDocument();
    expect(await screen.findByText('2024-04-01')).toBeInTheDocument();
    expect(await screen.findByText('2024-04-10')).toBeInTheDocument();
    expect(await screen.findByText('Jonas Jonaitis')).toBeInTheDocument();
  });

  test('renders FinishedAssignments component for teacher role', async () => {
    const mockUser = { id: 123, first_name: 'Jonas', last_name : 'Jonaitis', role : 2, gender : 2 };
    Cookies.set('user', JSON.stringify(mockUser));
    render(<BrowserRouter><FinishedAssignments/></BrowserRouter>);

    expect(await screen.findByText('Namų darbas')).toBeInTheDocument();
    expect(await screen.findByText('2024-04-01')).toBeInTheDocument();
    expect(await screen.findByText('2024-04-10')).toBeInTheDocument();
  });

});
