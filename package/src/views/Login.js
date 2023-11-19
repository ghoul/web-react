import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import CSS for transition

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(true); // State to control visibility

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setShowLoginForm(false); // Hide login form if user already logged in
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Token obtained successfully, store it in localStorage
        localStorage.setItem('admin', data.admin);
        localStorage.setItem('token', data.token);
        console.log('Login successful!'); setShowLoginForm(false); // Hide the login form on successful login
        // Navigate after a brief delay to allow for the transition
        setTimeout(() => {
          navigate(`/`);
        }, 500);
      } else {
        // Handle login error
        setError(data.error || 'Nepavyko prisijungti');
      }
    } catch (error) {
      // Handle network errors or other exceptions
      setError('Netinkamas prisijungimo vardas arba slaptažodis');
      console.error('Error during login:', error);
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
        background: `url(${process.env.PUBLIC_URL}/yoyoback2.png)`, // Replace with your image URL
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
            placeholder="Prisijungimo vardas"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
