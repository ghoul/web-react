// AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import Cookies from 'js-cookie';
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('token'));

  const login = (token) => {
    // Perform login actions and set token in localStorage
    Cookies.set('token', token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    // Perform logout actions and remove token from localStorage
    Cookies.remove('token');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
