import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Modal } from './Modal.js';
import { Modal2 } from './Modal2.js';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../layouts/config.js';
import Cookies from 'js-cookie';
// import './Style.css';
const AllHomework = () => {
  const [homework, setHomework] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState(null);
  let token = Cookies.get('token'); 
  const navigate  = useNavigate();
  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/handle_homework/`, {
          method: 'GET',
          headers: {
            'Authorization' : `${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setHomework(data.homework);
      } catch (error) {
        console.error('Error fetching Homework:', error);
      }
    };

    fetchHomework();
  }, []);

  const deleteHomework = () => {
    console.log("delete homework start");
    fetch(`${BACKEND_URL}/handle_homework_id/${selectedHomeworkId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization' : `${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        // Handle success, update homework state, and close the modal
        const updatedHomework = homework.filter(homework => homework.id !== selectedHomeworkId);
        setHomework(updatedHomework);
        hideModalHandler(); // Move hideModalHandler inside the .then() block
        // window.location.reload();
      })
      .catch(error => {
        // Handle error
        // window.location.reload();
        console.error('Error deleting homework:', error);
      });
  };
  

  const showModalHandler = (homeworkId) => {
    setSelectedHomeworkId(homeworkId);
    console.log("selectedid: " + selectedHomeworkId);
    setShowModal(true);
    console.log("modal show true");
  };

  const hideModalHandler = () => {
    setShowModal(false);
    console.log("modal show false");
  };
  const send = (event) => {
    navigate('/');
  }
  return (
    <div className="list">
      <Modal show={showModal} hide={hideModalHandler} onRemoveProduct={deleteHomework}></Modal>
      {/* <Modal2 showModal={showModal} handleClose={hideModalHandler} /> */}
      <Button style={{ backgroundColor: '#171a1e', color: 'white', marginBottom: '10px', border: 'none' }} onClick={send}> ← Į pradžią</Button>
      <Button  style={{
    backgroundColor: '#a6d22c',
    border: 'none',
    float: 'right', // Align to the right
    marginBottom: '10px',
  }}>
                  <Link to={`/create-homework`} className="nav-link" style={{ color: 'black' }}>
                  <i class="bi bi-plus"></i>  Kurti naują
                   
                  </Link>
                </Button>
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
              <td>{homework.questions}</td>
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
        ))
        )}
        
        </tbody>
      </Table>
    
    </div>
  );
};

export default AllHomework;
