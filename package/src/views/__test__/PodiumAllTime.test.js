import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import Podium from '../PodiumAllTime';
import Cookies from 'js-cookie';

jest.mock('axios');

describe('Podium component', () => {
  beforeEach(() => {
    const mockData = {
      leaderboard: [
        { student: 'Jonas', points: 100, gender: 1 },
        { student: 'Ona', points: 90, gender: 2 },
        { student: 'Bronius', points: 80, gender: 1 },
        { student: 'Marija', points: 70, gender: 2 },
        { student: 'Tomas', points: 60, gender: 1 },
      ],
      class_title: '8A',
    };
    axios.get.mockResolvedValueOnce({ data: mockData });
    Cookies.set('token', 'token');
    Cookies.set('csrftoken', 'csrftoken');
  });

  test('renders Podium component with correct title', async () => {
    render(<Podium />);
    await waitFor(() => {
      expect(screen.getByText('8A klasės lyderių lentelė')).toBeInTheDocument();
    });
  });

  test('renders top 3 students on the podium', async () => {
    render(<Podium />);
    await waitFor(() => {
      expect(screen.getByText('Jonas')).toBeInTheDocument();
    });
      expect(screen.getByText('Ona')).toBeInTheDocument();
      expect(screen.getByText('Bronius')).toBeInTheDocument();
    
  });

  test('renders rest of the students in the table', async () => {
    render(<Podium />);
    await waitFor(() => {
      expect(screen.getByText('Marija')).toBeInTheDocument();
    });
      expect(screen.getByText('Tomas')).toBeInTheDocument();
   
  });

  test('renders correct points for each student', async () => {
    render(<Podium />);
    await waitFor(() => {
      expect(screen.getByText('100xp')).toBeInTheDocument();
    });
      expect(screen.getByText('90xp')).toBeInTheDocument();
      expect(screen.getByText('80xp')).toBeInTheDocument();
      expect(screen.getByText('70')).toBeInTheDocument();
      expect(screen.getByText('60')).toBeInTheDocument();
    
  });
});
