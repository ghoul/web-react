
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BACKEND_URL from '../layouts/config';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import './Style.css';
import Cookies from 'js-cookie';
import axios from 'axios';
function Profile() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [message, setMessage] = useState('');
  const token = Cookies.get('token'); 
  const userString = Cookies.get('user');
  const user =JSON.parse(userString);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user_profile/${user.id}/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
          },
        });
        const userData = response.data;
        setName(userData.first_name);
        setSurname(userData.last_name);
        setEmail(userData.email);
        setSchool(userData.school_title);
      } catch (error) {
        console.error('Klaida:', error.message);
        setMessage("Klaida: " + error.message);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      email : email
    };

    try {
      const response = await axios.put(`${BACKEND_URL}/user_profile/${user.id}/`,
      updatedData, {
        headers: {
          'Authorization' : `Token ${token}`,
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken')
        }
      });
      if (response.status === 200) {
        setMessage('Operacija sėkminga!');
     }
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setMessage('Klaida! ' + error.response.data.error);
      } else {
          setMessage('Klaida!');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1>Profilio redagavimas</h1>
      {message && <div style={{ color: message.includes('Klaida') ? 'red' : 'green' }}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Vardas
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Vardas..."
            value={name}
            readOnly
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="surname" className="form-label">
            Pavardė
          </label>
          <input
            type="text"
            className="form-control"
            id="surname"
            placeholder="Pavardė..."
            value={surname}
            readOnly
            onChange={(e) => setSurname(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="school" className="form-label">
            Mokykla
          </label>
          <input
            type="text"
            className="form-control"
            id="school"
            placeholder="Mokykla"
            value={school}
            readOnly
           
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            El. paštas
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="El. paštas..."
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>      
       
        <button type="submit" style={{background:'#52a7b2', border:'none'}} className="btn btn-primary">
        <i class="bi bi-check me-1"></i> Išsaugoti 
        </button>
      </form>
      <br></br>
      <Button style={{background:'#a6d22c', border:'none'}}><Link to={`/password`} className="nav-link" style={{ color: 'white' }}>Keisti slaptažodį <i class="bi bi-arrow-right"></i> </Link></Button>
      <br></br><br></br>
      <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }}><Link to={`/`} className="nav-link" style={{ color: 'white' }}> ← Į pradžią </Link></Button>
    </div>
  );
}

export default Profile;
