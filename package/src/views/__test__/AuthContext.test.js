import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import Cookies from 'js-cookie';
import { AuthProvider, useAuth } from '../AuthContext';

jest.mock('js-cookie');

describe('AuthProvider component', () => {
  beforeEach(() => {
    Cookies.get.mockClear();
    Cookies.remove.mockClear();
  });

  test('initial state of isLoggedIn', () => {
    Cookies.get.mockReturnValueOnce(undefined);

    let isLoggedIn;
    const TestComponent = () => {
      const { isLoggedIn: isLoggedInContext } = useAuth();
      isLoggedIn = isLoggedInContext;
      return null;
    };

    render(<AuthProvider><TestComponent /></AuthProvider>);

    expect(isLoggedIn).toBe(false);
  });

  test('login function', async () => {
    const token = 'test-token';

    Cookies.get.mockReturnValueOnce(token);

    let isLoggedIn;
    let login;
    const TestComponent = () => {
      const { isLoggedIn: isLoggedInContext, login: loginContext } = useAuth();
      isLoggedIn = isLoggedInContext;
      login = loginContext;
      return null;
    };

    render(<AuthProvider><TestComponent /></AuthProvider>);

    expect(isLoggedIn).toBe(true);

    act(() => {
      login(token);
    });

    expect(isLoggedIn).toBe(true);
  });

  test('logout function', async () => {
    Cookies.get.mockReturnValueOnce('test-token');

    let isLoggedIn;
    let logout;
    const TestComponent = () => {
      const { isLoggedIn: isLoggedInContext, logout: logoutContext } = useAuth();
      isLoggedIn = isLoggedInContext;
      logout = logoutContext;
      return null;
    };

    render(<AuthProvider><TestComponent /></AuthProvider>);

    expect(isLoggedIn).toBe(true);

    act(() => {
      logout();
    });

    expect(isLoggedIn).toBe(false);

    expect(Cookies.remove).toHaveBeenCalledWith('token');
    expect(Cookies.remove).toHaveBeenCalledWith('csrf_token');
  });
});
