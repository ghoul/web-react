import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Modal } from './Modal.js';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../layouts/config.js';
import Cookies from 'js-cookie';
import axios from 'axios';

const AllHomework = () => {
  const [homework, setHomework] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(''); 
  const [selectedHomeworkId, setSelectedHomeworkId] = useState(null);
  let token = Cookies.get('token'); 
  const navigate  = useNavigate();
  useEffect(() => {
    const fetchHomework = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/homework/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken')
                },
            });
            setHomework(response.data);
        } catch (error) {
            console.error("Klaida: " + error);
        }
    };

    fetchHomework();
}, []);

  const deleteHomework = async () => {
    console.log('Delete homework function called');
      try {
        const response = await  axios.delete(`${BACKEND_URL}/homework/${selectedHomeworkId}/`, {
          headers: {
            'Authorization' : `Token ${token}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
          },
        });
        if (response.status != 204) {
          if(response.data.error){
            setMessage("Klaida! " + response.data.error);
          }else{
            setMessage("Klaida!");
          }
        }
        setHomework(prevHomework => prevHomework.filter(homework => homework.id !== selectedHomeworkId));
        hideModalHandler();
    } catch (error) {
        console.error("Klaida: " + error);
        if (error.response && error.response.data && error.response.data.error) {
          setMessage('Klaida! ' + error.response.data.error);
        } else {
            setMessage('Klaida!');
        }
    }
  };
  

  const showModalHandler = (homeworkId) => {
    setSelectedHomeworkId(homeworkId);
    setShowModal(true);
  };

  const hideModalHandler = () => {
    setShowModal(false);
  };
  const send = (event) => {
    navigate('/');
  }
  return (
    <div className="list">
      <Modal show={showModal} hide={hideModalHandler} onConfirm={deleteHomework}></Modal>
      <Button style={{ backgroundColor: '#171a1e', color: 'white', marginBottom: '10px', border: 'none' }} onClick={send}> ← Į pradžią</Button>
      <Button  style={{backgroundColor: '#a6d22c', border: 'none', float: 'right', marginBottom: '10px',}}>
            <Link to={`/create-homework`} className="nav-link" style={{ color: 'black' }}>
            <i class="bi bi-plus"></i>  Kurti naują 
            </Link>
      </Button>
      {message && <div style={{ marginBottom: '10px', color: message.includes('Klaida') ? 'red' : 'green' }}>{message}</div>}
      <Table>
        <thead>
          <tr>
            <th>Pavadinimas</th>
            <th>Klausimų skaičius</th>
            <th>Peržiūrėti</th>
            <th>Paskirti</th>
            <th>Šalinti</th>
          </tr>
        </thead>
        <tbody>
        {homework.length === 0 ? (
          <tr>
            <td colSpan="3">Namų darbų nėra</td>
          </tr>
        ) : (
          homework.map((homework) => (
            <tr key={homework.id}>
              <td>{homework.title}</td>
              <td>{homework.num_questions}</td>
              <td>
              <Button style={{ backgroundColor: 'transparent', marginRight: '10px', border: 'none' }}>
                <Link to={`/check-homework/${homework.id}`} className="nav-link" style={{ color: 'black', fontWeight: 'bold' }}>
                  <i className="bi bi-eye" style={{ fontSize: '1.5em' }}></i>
                </Link>
              </Button>
              </td>
              <td>
                <Button style={{ backgroundColor: 'transparent', marginRight: '10px', border: 'none' }}>
                  <Link to={`/assign-homework/${homework.id}`} className="nav-link" style={{ color: 'black' }}> 
                  <i class="bi bi-calendar-plus" style={{ fontSize: '1.5em' }}></i>
                  </Link>
                </Button>
                </td>
              <td>
             <Button style={{  border: 'none', background: 'transparent' }} onClick={() => showModalHandler(homework.id)}>             
                ✖
                </Button>
               </td>
            </tr>
        )))}
        </tbody>
      </Table>
    
    </div>
  );
};

export default AllHomework;
