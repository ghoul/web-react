import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BACKEND_URL from '../layouts/config';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

function ChangePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  let token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Klaida! Nesutampa slaptažodžiai');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/change_password/`, {
        method: 'PUT',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      const result = await response.json();
      console.log("result: " + result);
    if (result.success) {
      setMessage('Slaptažodis pakeistas sėkmingai');
    } else {
      setMessage(result.error);
    }
      setTimeout(() => {
        setMessage('');
      }, 5000);
    } catch (error) {
      console.error('Error changing passworddd', error);
      setMessage('Klaida! Nepavyko pakeisti slaptažodžio');
    }
  };

  return (
    <div className="container mt-5">
      
      <h1>Slaptažodžio keitimas</h1>
      {message && <div style={{ color: message.includes('Klaida') ? 'red' : 'green' }}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Naujas slaptažodis
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Naujas slaptažodis..."
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Patvirtinkite naują slaptažodį
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            placeholder="Patvirtinkite naują slaptažodį..."
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Keisti slaptažodį
        </button>
      </form>
<br></br>
      <Button><Link to={`/profile`} className="nav-link" style={{ color: 'white' }}> ← Atgal </Link></Button>
    </div>
  );
}

export default ChangePassword;
