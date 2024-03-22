import React, { createContext, useState, useContext } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('token'));

  const login = (token) => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('csrf_token');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
