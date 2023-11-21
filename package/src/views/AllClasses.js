import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Modal } from './Modal.js';
import { useNavigate } from 'react-router-dom';
const AllClasses = () => {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  let token = localStorage.getItem('token'); 
  const navigate  = useNavigate();
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:8000/handle_classes/', {
          method: 'GET',
          headers: {
            'Authorization' : `${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching Classes:', error);
      }
    };

    fetchClasses();
  }, []);

  const deleteClass = () => {
    fetch(`http://localhost:8000/handle_classes/${selectedClassId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization' : `${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        // Handle success, update classes state, and close the modal
        const updatedClasses = classes.filter(classs => classs.id !== selectedClassId);
        setClasses(updatedClasses);
        hideModalHandler(); // Move hideModalHandler inside the .then() block
        // window.location.reload();
      })
      .catch(error => {
        // Handle error
        // window.location.reload();
        console.error('Error deleting classs:', error);
      });
  };
  

  const showModalHandler = (classsId) => {
    setSelectedClassId(classsId);
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
      <Modal show={showModal} hide={hideModalHandler} onRemoveProduct={deleteClass}></Modal>
      <Button style={{ backgroundColor: '#171a1e', color: 'white', marginBottom: '10px' }} onClick={send}> ← Į pradžią</Button>
      <Table>
        <thead>
          <tr>
            <th>Pavadinimas</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classs) => (
            <tr key={classs.id}>
              <td>{classs.title}</td>
              <td>
                <Button style={{ backgroundColor: '#204963', marginRight: '10px' }}>
                    {/* TODO: nukreipia i puslapi su klases pavadinimo redagavimu eilute ir mokiniu saraso redagavimu */}
                  <Link to={`/edit-class/${classs.id}`} className="nav-link" style={{ color: 'white' }}> 
                    Redaguoti
                  </Link>
                </Button>
                <Button style={{ backgroundColor: 'orange', color: '#204963' }} onClick={() => showModalHandler(classs.id)}>
                  Šalinti
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button style={{ backgroundColor: '#204963', marginRight: '10px' }}>
                  <Link to={`/create-class`} className="nav-link" style={{ color: 'white' }}>
                    Pridėti naują
                  </Link>
                </Button>
    </div>
  );
};

export default AllClasses;
