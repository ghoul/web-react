import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import BACKEND_URL from '../layouts/config';
import './Style.css';
import { useAuth } from './AuthContext';
import Cookies from 'js-cookie';
import axios from 'axios';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(true);
  const { login } = useAuth();

  useEffect(() => {
    const token = Cookies.get('token'); 
    if (token) {
      setShowLoginForm(false);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/login/`,
      {email: email,
       password: password}, {
       headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        Cookies.set('csrftoken', response.data.csrf_token, { secure: true, sameSite: 'strict' });
        Cookies.set('token', response.data.token, { secure: true, sameSite: 'strict' });
        Cookies.set('user', JSON.stringify(response.data.user),{ secure: true, sameSite: 'strict' });
  
        login(response.data.token); 
        
        setTimeout(() => {
          if(response.data.user.role === 3){
            navigate(`/manage-school`);
          } else{
            navigate(`/`);
          }
         
        }, 500);
      } else {
        setError(response.data.error || 'Nepavyko prisijungti');
      }
    } catch (error) {
      setError("Neteisingas el. paštas arba slaptažodis");
    }
  };

  return (
    <div className={`login-container ${showLoginForm ? 'visible' : 'hidden'}`}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: `url(${process.env.PUBLIC_URL}/fonasg.png)`, 
        backgroundSize: 'cover',
      }}
    >
      <div
        style={{
          padding: '50px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          background: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Prisijungimas</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="El. paštas"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ margin: '10px', padding: '8px', borderRadius: '4px', width: '200px' }}
          />
          <input
            type="password"
            placeholder="Slaptažodis"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ margin: '10px', padding: '8px', borderRadius: '4px', width: '200px' }}
          />
          <button onClick={handleLogin} style={{ margin: '10px', padding: '8px 16px', borderRadius: '4px', background: '#F17F1D', color: '#fff', border: 'none', cursor: 'pointer' }}>Prisijungti</button>
          {error && (
            <div style={{ margin: '10px', padding: '10px', borderRadius: '4px', background: 'rgba(255, 0, 0, 0.1)', border: '1px solid #FF0000', color: '#FF0000', textAlign: 'center' }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

export default LoginForm;
