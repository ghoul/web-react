import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter, useParams } from 'react-router-dom';
import AssignmentTest from '../AssignmentTest';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


jest.mock('axios');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('AssignmentTest component', () => {
  let disableBeforeEach = false;
    beforeEach(() => {
      if (disableBeforeEach) {
        return;
      }
        const mockUser = { id: 1, first_name: 'Jonas', last_name : 'Jonaitis', role : 1, gender : 2 };
        Cookies.set('user', JSON.stringify(mockUser));
        Cookies.set('token', 'token');
        Cookies.set('csrftoken', 'csrftoken');
    
    useParams.mockReturnValue({ assignmentId: '123' });

   
  });

  test('renders assignment test form', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          question: 'Klausimas 1',
          points: 5,
          qtype: 1,
          homework_title: 'Namų darbas',
          options: [
            { id: 1, text: 'Pasirinkimas 1' },
            { id: 2, text: 'Pasirinkimas 2' },
          ],
        },
        {
          id: 2,
          question: 'Klausimas 2',
          points: 10,
          qtype: 2,
          homework_title: 'Namų darbas',
          options: [],
        },
      ],
    });
    render(<BrowserRouter><AssignmentTest /></BrowserRouter>);
    
    await waitFor(() => {
      expect(screen.getByText('1. Klausimas 1')).toBeInTheDocument();
    });
      expect(screen.getByText('2. Klausimas 2')).toBeInTheDocument();
  });

  test('submits assignment answers successfully', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          question: 'Klausimas 1',
          points: 5,
          qtype: 1,
          homework_title: 'Namų darbas',
          options: [
            { id: 1, text: 'Pasirinkimas 1' },
            { id: 2, text: 'Pasirinkimas 2' },
          ],
        },
        {
          id: 2,
          question: 'Klausimas 2',
          points: 10,
          qtype: 2,
          homework_title: 'Namų darbas',
          options: [],
        },
      ],
    });
    axios.post.mockResolvedValueOnce({status: 201,});

    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    render(<BrowserRouter><AssignmentTest /></BrowserRouter>);

    await waitFor(() => {
        expect(screen.getByText('1. Klausimas 1')).toBeInTheDocument();
      });

    fireEvent.change(screen.getByTestId('question1'), { target: { value: 'Sample answer 1' } });
    fireEvent.change(screen.getByTestId('question0option0'), { target: { value: true } });

    fireEvent.click(screen.getByText('Pateikti'));
    fireEvent.click(screen.getByText('Taip'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/test/123/'),
        expect.any(FormData),
        {
          headers: {
            'Authorization': 'Token token',
            'X-CSRFToken': 'csrftoken',
          },
        }
      );
    });
    expect(mockNavigate).toHaveBeenCalledWith(`/statistics/123/1`);
  });

  test('displays error message if submission fails', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          question: 'Klausimas 1',
          points: 5,
          qtype: 1,
          homework_title: 'Namų darbas',
          options: [
            { id: 1, text: 'Pasirinkimas 1' },
            { id: 2, text: 'Pasirinkimas 2' },
          ],
        },
        {
          id: 2,
          question: 'Klausimas 2',
          points: 10,
          qtype: 2,
          homework_title: 'Namų darbas',
          options: [],
        },
      ],
    });
    axios.post.mockRejectedValueOnce(new Error('Nepavyko išsaugoti atsakymų'));
    render(<BrowserRouter><AssignmentTest /></BrowserRouter>);

    await waitFor(() => {
        expect(screen.getByText('1. Klausimas 1')).toBeInTheDocument();
      });

    fireEvent.change(screen.getByTestId('question1'), { target: { value: 'Sample answer' } });
    fireEvent.click(screen.getByText('Pateikti'));
    fireEvent.click(screen.getByText('Taip'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/test/123/'),
        expect.any(FormData),
        {
          headers: {
            'Authorization': 'Token token',
            'X-CSRFToken': 'csrftoken',
          },
        }
      );
    });
    await waitFor(() => {
    expect(screen.getByText('Klaida!')).toBeInTheDocument();
    });
  });

  test('submits form with valid data for multiple options question', async () => {
   
    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          question: 'Klausimas 1',
          points: 15,
          qtype: 3,
          homework_title: 'Namų darbas',
          options: [
            { id: '1', text: 'Pasirinkimas 1' },
            { id: '2', text: 'Pasirinkimas 2' },
            { id: '3', text: 'Pasirinkimas 3' },
          ],
        }
      ],
    });

    axios.post.mockResolvedValueOnce({ status: 201 });
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
   
    render(<BrowserRouter><AssignmentTest /></BrowserRouter>);

    await waitFor(() => {
     screen.getByText('1. Klausimas 1');
    });

    fireEvent.click(screen.getByTestId('question0option0'));
    fireEvent.click(screen.getByTestId('question0option1')); 

    fireEvent.click(screen.getByText('Pateikti'));
    fireEvent.click(screen.getByText('Taip'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/test/123/'),
        expect.any(FormData),
        {
          headers: {
            'Authorization': 'Token token',
            'X-CSRFToken': 'csrftoken',
          },
        }
      );
    });
    expect(mockNavigate).toHaveBeenCalledWith(`/statistics/123/1`);
  });

});
