import { useEffect, useState } from "react";

// Custom hook to manage authentication state
const CheckToken = () => {
  const [token, setToken] = useState(localStorage.getItem('token') !== null);

  const handleLoginn = (newToken) => {
    // Logic to handle login - save the new token to localStorage
    localStorage.setItem('token', newToken);
    // Update the token state
    setToken(true);
  };

  const handleLogoutt = () => {
    // Logic to handle logout - remove token from localStorage
    localStorage.removeItem('token');
    // Update the token state
    setToken(false);
  };

  return { token, handleLoginn, handleLogoutt };
};

export default CheckToken;
