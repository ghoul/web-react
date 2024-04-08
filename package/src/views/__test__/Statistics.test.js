import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import Statistics from '../Statistics';
import { BrowserRouter} from 'react-router-dom';
import Cookies from 'js-cookie';

jest.mock('axios');

describe('Statistics component', () => {
    beforeEach(() => {
        const mockUser = { id: 123, first_name: 'Jonas', last_name : 'Jonaitis', role : 2, gender : 2 };
        Cookies.set('user', JSON.stringify(mockUser));
        Cookies.set('token', 'token');
        Cookies.set('csrftoken', 'csrftoken');
      });

  test('displays assignment statistics correctly', async () => {
    const mockStudents = [
      {
        student_first_name: 'Jonas',
        student_last_name: 'Jonaitis',
        status: 'Good',
        date: '2024-04-01',
        time: '00:12:00',
        points: 90,
        student_gender: 1,
        student: '456'
      },
    ];
    const mockTitle = 'Namų darbas';
    const mockClass = '8A';

    axios.get.mockResolvedValueOnce({ data: { 
      assignment_results: mockStudents,
      assignment: {
        title: mockTitle,
        class_title: mockClass
      }
    } });

    render(<BrowserRouter><Statistics/></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText(mockTitle)).toBeInTheDocument();
    });
      expect(screen.getByText('Namų darbo suvestinė')).toBeInTheDocument();
      expect(screen.getByText('Jonas')).toBeInTheDocument();
      expect(screen.getByText('Jonaitis')).toBeInTheDocument();
    });
  });

  test('downloads assignment data correctly', async () => {
    const mockStudents = [
      {
        student_first_name: 'Jonas',
        student_last_name: 'Jonaitis',
        status: 'Good',
        date: '2024-04-01',
        time: '10:00:00',
        points: 90,
        student_gender: 1,
        student: '456',
        grade: 10,
      },
    ];
    const mockTitle = 'Namų darbas';
    const mockClass = '8A';

    axios.get.mockResolvedValueOnce({ data: { 
      assignment_results: mockStudents,
      assignment: {
        title: mockTitle,
        class_title: mockClass
      }
    } });

    render(<BrowserRouter><Statistics /></BrowserRouter>);
    const downloadButton = screen.getByRole('button', { name: /parsisiųsti/i });
    expect(downloadButton).toBeInTheDocument();
  
  });


