import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Modal } from './Modal.js';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../layouts/config.js';
const AllHomework = () => {
  const [homework, setHomework] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState(null);
  let token = localStorage.getItem('token'); 
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
      <Modal show={showModal} hide={hideModalHandler} onRemoveProduct={deleteHomework}></Modal>
      <Button style={{ backgroundColor: '#171a1e', color: 'white', marginBottom: '10px' }} onClick={send}> ← Į pradžią</Button>
      <Table>
        <thead>
          <tr>
            <th>Pavadinimas</th>
            <th>Klausimų skaičius</th>
            <th></th>
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
              <Button style={{ backgroundColor: '#204963', marginRight: '10px' }}>
                  <Link to={`/check-homework/${homework.id}`} className="nav-link" style={{ color: 'white' }}> 
                    Peržiūrėti
                  </Link>
                </Button>
                <Button style={{ backgroundColor: '#204963', marginRight: '10px' }}>
                  <Link to={`/assign-homework/${homework.id}`} className="nav-link" style={{ color: 'white' }}> 
                    Paskirti
                  </Link>
                </Button>
                {/* perkelt i check */}
                {/* <Button style={{ backgroundColor: '#204963', marginRight: '10px' }}>
                  <Link to={`/edit-homework/${homework.id}`} className="nav-link" style={{ color: 'white' }}> 
                    Redaguoti
                  </Link>
                </Button> */}
                <Button style={{ backgroundColor: 'orange', color: '#204963' }} onClick={() => showModalHandler(homework.id)}>
                  Šalinti
                </Button>
              </td>
            </tr>
        ))
        )}
        
        </tbody>
      </Table>
      <Button style={{ backgroundColor: '#204963', marginRight: '10px' }}>
                  <Link to={`/create-homework`} className="nav-link" style={{ color: 'white' }}>
                    Pridėti naują
                  </Link>
                </Button>
    </div>
  );
};

export default AllHomework;
