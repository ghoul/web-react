import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BACKEND_URL from '../../layouts/config';
import LoginForm from '../Login';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BrowserRouter} from 'react-router-dom';

// Mocking axios post method
jest.mock('axios');
jest.mock('../AuthContext', () => ({
    useAuth: () => ({
      login: jest.fn(), // Mocking the login function
    }),
  }));
jest.mock('js-cookie', () => ({
    get: jest.fn(),
    set: jest.fn(),
  }));

describe('LoginForm component', () => {
  test('renders login form and handles login', async () => {
    render(<BrowserRouter><LoginForm /></BrowserRouter>);
    
    expect(screen.getByPlaceholderText('El. paštas')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Slaptažodis')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Prisijungti' })).toBeInTheDocument();

    const mockResponseData = {
      status: 200,
      data: {
        csrf_token: 'csrf-token',
        token: 'token',
        user: { id: 123, first_name: 'first', last_name : 'last', role : 1, gender : 2 }
      },
    };

    axios.post.mockResolvedValue(mockResponseData);

    fireEvent.change(screen.getByPlaceholderText('El. paštas'), { target: { value: 'test@goose.com' } });
    fireEvent.change(screen.getByPlaceholderText('Slaptažodis'), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: 'Prisijungti' }));

    await screen.findByText('Prisijungimas');

    expect(axios.post).toHaveBeenCalledWith(
       `${BACKEND_URL}/login/`,
      { email: 'test@goose.com', password: 'password' },
      { headers: { 'Content-Type': 'application/json' } }
    );

    expect(Cookies.set).toHaveBeenCalledTimes(3);
    expect(Cookies.set).toHaveBeenCalledWith('csrftoken', 'csrf-token', { secure: true, sameSite: 'strict' });
    expect(Cookies.set).toHaveBeenCalledWith('token', 'token', { secure: true, sameSite: 'strict' });
    expect(Cookies.set).toHaveBeenCalledWith('user', JSON.stringify({ id: 123, first_name: 'first', last_name : 'last', role : 1, gender : 2 }), { secure: true, sameSite: 'strict' });

    expect(window.location.href).toContain('/'); 
  });

  test('handles bad credentials', async () => {
    render(<BrowserRouter><LoginForm /></BrowserRouter>);
    
    const mockResponseData = {
      response: { status: 401 },
      data: { error: 'Neteisingas el. paštas arba slaptažodis' },
    };

    axios.post.mockRejectedValue(mockResponseData);

    fireEvent.change(screen.getByPlaceholderText('El. paštas'), { target: { value: 'test@goosee.com' } });
    fireEvent.change(screen.getByPlaceholderText('Slaptažodis'), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: 'Prisijungti' }));
    await screen.findByText('Neteisingas el. paštas arba slaptažodis');

    expect(screen.getByText('Neteisingas el. paštas arba slaptažodis')).toBeInTheDocument();
  });

});
