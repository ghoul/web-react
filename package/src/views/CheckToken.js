import { useEffect, useState } from "react";
import Cookies from "js-cookie";
// Custom hook to manage authentication state
const CheckToken = () => {
  const [token, setToken] = useState(Cookies.get('token') !== null);

  const handleLoginn = (newToken) => {
    // Logic to handle login - save the new token to localStorage
    Cookies.set('token', newToken);
    // Update the token state
    setToken(true);
  };

  const handleLogoutt = () => {
    // Logic to handle logout - remove token from localStorage
   Cookies.remove('token');
    // Update the token state
    setToken(false);
  };

  return { token, handleLoginn, handleLogoutt };
};

export default CheckToken;
