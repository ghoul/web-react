import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import Profile from '../Profile';
import { BrowserRouter} from 'react-router-dom';
import Cookies from 'js-cookie';
import BACKEND_URL from '../../layouts/config';

jest.mock('axios');

describe('Profile component', () => {
    beforeEach(() => {
        const mockUser = { id: 123, first_name: 'Jonas', last_name : 'Jonaitis', role : 1, gender : 2 };
        Cookies.set('user', JSON.stringify(mockUser));
        Cookies.set('token', 'token');
        Cookies.set('csrftoken', 'csrftoken');
      });

  test('fetches and displays user profile data correctly', async () => {
    const userData = {
      first_name: 'Jonas',
      last_name: 'Jonaitis',
      email: 'jonaitis@goose.com',
      school_title: 'Goose gimnazija',
    };
    axios.get.mockResolvedValueOnce({ data: userData });

    render(<BrowserRouter><Profile /></BrowserRouter>);

    expect(axios.get).toHaveBeenCalledWith(`${BACKEND_URL}/user_profile/123/`, {
      headers: {
        Authorization: 'Token token',
        'Content-Type': 'application/json',
        'X-CSRFToken': 'csrftoken', 
      },
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Vardas')).toHaveValue('Jonas');
        });
      expect(screen.getByLabelText('Pavardė')).toHaveValue('Jonaitis');
      expect(screen.getByLabelText('El. paštas')).toHaveValue('jonaitis@goose.com');
      expect(screen.getByLabelText('Mokykla')).toHaveValue('Goose gimnazija');
  
  });

  test('updates user email address on form submission', async () => {
    const userData = {
      id: 123,
    };
    const updatedData = {
      email: 'jonaitis2@goose.com',
    };
    axios.get.mockResolvedValueOnce({ data: userData });
    axios.put.mockResolvedValueOnce({ status: 200 });

    render(<BrowserRouter><Profile /></BrowserRouter>);

    expect(screen.getByLabelText('El. paštas')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('El. paštas'), {
        target: { value: 'jonaitis2@goose.com' },
    });

    await waitFor(() => {
        expect(screen.getByLabelText('El. paštas').value).toBe('jonaitis2@goose.com');
    });
    
    fireEvent.submit(screen.getByText('Išsaugoti'));

    expect(axios.put).toHaveBeenCalledWith(`${BACKEND_URL}/user_profile/123/`, updatedData, {
      headers: {
        Authorization: 'Token token',
        'Content-Type': 'application/json',
        'X-CSRFToken': 'csrftoken',
      },
    });
  });

  test('displays error message on form submission failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Nepavyko gauti vartotojo profilio duomenų'));
    render(<BrowserRouter><Profile /></BrowserRouter>);
    fireEvent.submit(screen.getByText('Išsaugoti'));
    expect(await screen.findByText("Klaida: Nepavyko gauti vartotojo profilio duomenų")).toBeInTheDocument();
  });
  
});
