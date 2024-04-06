import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import OneStudentStatistics from '../OneStudentStatistics';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

describe('OneStudentStatistics component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        results: [
          {
            question: {
              homework: { title: 'Namų darbas' },
              question: 'Klausimas 1',
              points: 10,
              qtype: 2,
              answer: 'Atsakymas 1'
            },
            points: 10,
            answer: 'Atsakymas 1',
            selected_options: [],
            student: { first_name: 'Jonas', last_name: 'Jonaitis' }
          },
          {
            question: {
              homework: { title: 'Namų darbas' },
              question: 'Klausimas 2',
              points: 10,
              qtype: 1,
              options: [
                { id: 1, text: 'Pasirinkimas 1' },
                { id: 2, text: 'Pasirinkimas 2' }
              ],
              correct_options: [{ id: 1, text: 'Pasirinkimas 1' }]
            },
            points: 5,
            selected_options: [{ student: 'studentId', question: 2, option: 1 }]
          }
        ],
        points: 20,
        score: 15,
        grade: 8,
        
      }
    });
  });

  test('fetches student statistics data and renders correctly', async () => {
    render(<BrowserRouter><OneStudentStatistics /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('Namų darbas')).toBeInTheDocument();
    });
      expect(screen.getByText('Jonas Jonaitis')).toBeInTheDocument();
      expect(screen.getByText('15/20')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('1/2')).toBeInTheDocument(); 
      expect(screen.getByText('1. Klausimas 1')).toBeInTheDocument();
      expect(screen.getByText('2. Klausimas 2')).toBeInTheDocument();
   
  });

  test('calculates and displays the correct statistics', async () => {
    render(<BrowserRouter><OneStudentStatistics /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('8')).toBeInTheDocument(); 
    });
      expect(screen.getByText('15/20')).toBeInTheDocument();
      expect(screen.getByText('1/2')).toBeInTheDocument(); 
    
  });

  test('renders question-answer pairs correctly', async () => {
    render(<BrowserRouter><OneStudentStatistics /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('1. Klausimas 1')).toBeInTheDocument();
    });
      expect(screen.getByText('2. Klausimas 2')).toBeInTheDocument();
      expect(screen.getByText('Pasirinkimas 1')).toBeInTheDocument();
      expect(screen.getByText('Pasirinkimas 2')).toBeInTheDocument();
   
  });
});
