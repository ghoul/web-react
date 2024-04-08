import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import ChangePassword from '../ChangePassword';
import { BrowserRouter} from 'react-router-dom';
import Cookies from 'js-cookie';

jest.mock('axios');

describe('ChangePassword component', () => {

  beforeEach(() => {
    const mockUser = { id: 123, first_name: 'Jonas', last_name : 'Jonaitis', role : 1, gender : 2 };
    Cookies.set('user', JSON.stringify(mockUser));
  });
      
  test('submits password change form with matching passwords', async () => {
    axios.put.mockResolvedValueOnce({ status: 200 });
    render(<BrowserRouter><ChangePassword /></BrowserRouter>);
    fireEvent.change(screen.getByLabelText('Naujas slaptažodis'), { target: { value: 'newpassword' } });
    fireEvent.change(screen.getByLabelText('Patvirtinkite naują slaptažodį'), { target: { value: 'newpassword' } });

    fireEvent.click(screen.getByText('Keisti slaptažodį'));

    await expect(axios.put).toHaveBeenCalled();
  });

  test('displays error message for non-matching passwords', async () => {
    render(<BrowserRouter><ChangePassword /></BrowserRouter>);
    fireEvent.change(screen.getByLabelText('Naujas slaptažodis'), { target: { value: 'password1' } });
    fireEvent.change(screen.getByLabelText('Patvirtinkite naują slaptažodį'), { target: { value: 'password2' } });

    fireEvent.click(screen.getByText('Keisti slaptažodį'));

    await expect(screen.getByText('Klaida! Nesutampa slaptažodžiai')).toBeInTheDocument();
  });

});
