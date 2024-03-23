import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BACKEND_URL from '../layouts/config';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import './Style.css';
import Cookies from 'js-cookie';
import axios from 'axios';

function ChangePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const token = Cookies.get('token'); 
  const userString = Cookies.get('user');
  var userData = JSON.parse(userString); 
  const userId = userData.id;
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Klaida! Nesutampa slaptažodžiai');
      return;
    }

    try {
       const response = await axios.put(`${BACKEND_URL}/password/${userId}/`, 
       {password: password
      }, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken')
        }
      });

      if (response.status == 200) {
        setMessage("Operacija sėkminga!");
      }
      setTimeout(() => {
        setMessage('');
      }, 5000);
    } catch (error) {
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
        <button type="submit" className="btn btn-primary" style={{background:'#a6d22c', border:'none'}}>
          Keisti slaptažodį
        </button>
      </form>
      <br></br>
      <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }}><Link to={`/profile`} className="nav-link" style={{ color: 'white' }}> ← Atgal </Link></Button>
    </div>
  );
}

export default ChangePassword;
