import React, { useState } from 'react';
import BACKEND_URL from '../layouts/config';
import './Style.css';
function SignupForm() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('1');
  const [gender, setGender] = useState('1');
  

  const handleSignup = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, surname, password, email, gender, role }),
      });

      const data = await response.json();
      if (response.ok) {
        // Signup successful, obtain JWT token and store it in localStorage
        localStorage.setItem('token', data.token);
        // Redirect or update UI based on successful signup
        console.log('Signup successful!');
        console.log('token: ' + data.token);
        console.log('role: ' + data.role);
      } else {
        // Handle signup error
        console.error('Signup failed:', data.error);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error during signup:', error);
    }
  };

  return (
    <div className="login-container visible">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: `url(${process.env.PUBLIC_URL}/yoyoback2.png)`,
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
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Registracija</h2>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Vardas"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ margin: '10px', padding: '8px', borderRadius: '4px', width: '200px' }}
            />
            <input
              type="text"
              placeholder="Pavardė"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              style={{ margin: '10px', padding: '8px', borderRadius: '4px', width: '200px' }}
            />
            <input
              type="email"
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
             <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{ margin: '10px', padding: '8px', borderRadius: '4px', width: '200px' }}
            >
              <option value="1">Vyras</option>
              <option value="2">Moteris</option>
            </select>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ margin: '10px', padding: '8px', borderRadius: '4px', width: '200px' }}
            >
              <option value="1">Mokinys</option>
              <option value="2">Mokytojas</option>
            </select>
            <button
              onClick={handleSignup}
              style={{
                margin: '10px',
                padding: '8px 16px',
                borderRadius: '4px',
                background: '#F17F1D',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Registruotis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
