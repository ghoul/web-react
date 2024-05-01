import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import BACKEND_URL from '../layouts/config.js';
import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import { Modal } from "./Modal.js";
import './Style.css';
import Cookies from 'js-cookie';

const Starter = () => {
  const [homeworkTeacher, setHomeworkTeacher] = useState([]);
  const [homeworkStudent, setHomeworkStudent] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const token = Cookies.get('token'); 
  const userString = Cookies.get('user');
  var userData = userString ? JSON.parse(userString) : ''
  let role = "";
  let user_id = "";
  if(userData !== '')
  {
    role = userData.role; 
    user_id = userData.id;
  }

  const getAssignments = () => {
    if (role === 2) {
    axios.get(`${BACKEND_URL}/assignments_teacher/`, {
      headers: {
        'Authorization' : `Token ${token}`,
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken')
      },
    }) 
      .then(response => {
        setHomeworkTeacher(response.data);
      })
      .catch(error => {
        console.error('Klaida:', error);
      });
    } else if (role === 1){
      axios.get(`${BACKEND_URL}/assignments_student/`, {
      headers: {
        'Authorization' : `Token ${token}`,
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken')
      },
    })
      .then(response => {
        setHomeworkStudent(response.data);
      })
      .catch(error => {
        console.error('Klaida:', error);
      });
    }

  };
  useEffect(() => {
    getAssignments();
  }, []);

  const showModalHandler = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setShowModal(true);
  };

  const hideModalHandler = () => {
    setShowModal(false);
  };

  const deleteAssignment = async (e) => {
    try{
      const response = await axios.delete(`${BACKEND_URL}/assignments_teacher/${selectedAssignmentId}/`, {
          headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
              'X-CSRFToken': Cookies.get('csrftoken')
          },
      });
        if(response.status != 204){
          if (response.data.error) {
            setMessage('Klaida! ' + response.data.error);
          } else {
              setMessage('Klaida!');
          }
        }
          hideModalHandler();
          getAssignments();
  }
  catch(error){
    console.error('Klaida:', error);
    if (error.response && error.response.data && error.response.data.error) {
      setMessage('Klaida! ' + error.response.data.error);
    } else {
        setMessage('Klaida!');
    }
  }
};

  const handleStartGame = async (assignmentId) => {
    try {    
        const url = `http://localhost:8080/?student_id=${user_id}&assignment_id=${assignmentId}`;
        window.open(url, '_blank');
    } catch (error) {
      console.error('Klaida:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setMessage('Klaida! ' + error.response.data.error);
      } else {
          setMessage('Klaida!');
      }
    }
  };

  return (
    <div>
   <Card>
   <Modal show={showModal} hide={hideModalHandler} onConfirm={deleteAssignment}></Modal>
        <CardBody>
          <CardTitle tag="h5">Aktyvūs namų darbai</CardTitle>
          {role === 2 && (
          <>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Statistika
          </CardSubtitle>
          {message && <div style={{ color: message.includes('Klaida') ? 'red' : 'green' }}>{message}</div>}
          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>Pavadinimas</th>
                <th>Pradžios data</th>
                <th>Pabaigos data</th>
                <th>Klasė</th>
                <th>Būsena</th>
                <th>Statistika</th>
                <th>Keisti</th>
                <th>Šalinti</th>
              </tr>
            </thead>
            <tbody>
            {homeworkTeacher.length === 0 ? (
        <tr className="border-top">
        <td colSpan="6" style={{ textAlign: 'center', fontStyle: 'italic', color: '#888' }}>Aktyvių namų darbų nėra</td>
          </tr>
            ) : (homeworkTeacher.map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>{tdata.homework_title}</td>
                  <td>{tdata.from_date}</td>
                  <td>{tdata.to_date}</td>
                  <td>{tdata.classs_title}</td>
                  <td>
                    {tdata.status === "Bad" ? (
                      <span className="p-2 rounded-circle d-inline-block ms-3" style={{ backgroundColor: '#bf1a2f' }}></span> 
                    ) : tdata.status === "Average" ? (
                      <span className="p-2 rounded-circle d-inline-block ms-3"  style={{ backgroundColor: '#f3943c' }}></span> 
                    ) : (
                      <span className="p-2 rounded-circle d-inline-block ms-3" style={{ backgroundColor: '#a6d82b' }}></span>
                    )}
                  </td>
                  <td>
                  <Button className='noback-button' style={{background:'transparent', border:'none'}}>
                    <Link to={`/statistics/${tdata.id}`} className="nav-link" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}> ➔➔</Link>
                  </Button>
                  </td>
                  <td><Button className='noback-button' style={{background:'transparent', border:'none'}}>
                  <Link to={`/assignment/edit/${tdata.id}`} className="nav-link" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}> <i class="bi bi-pencil-fill"></i></Link>
                    </Button></td>
                  <td>
                    <Button className='noback-button' style={{background:'transparent', border:'none'}} onClick={() => showModalHandler(tdata.id)}>
                    ✖
                    </Button>
                  </td>
                </tr>
              )))}
            </tbody>
          </Table>
          </>
        )}
         {role === 1 && (
          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>Pavadinimas</th>
                <th>Pradžios data</th>
                <th>Pabaigos data</th>
                <th>Mokytojas</th>
                <th>Žaisti</th>
                <th>Testas</th>
              </tr>
            </thead>
            <tbody>
            {homeworkStudent.length === 0 ? (
                <tr className="border-top">
                  <td colSpan="6" style={{ textAlign: 'center', fontStyle: 'italic', color: '#888' }}>Neatliktų namų darbų nėra</td>
                </tr>
            ) : (homeworkStudent.map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>{tdata.homework_title}</td>
                  <td>{tdata.from_date}</td>
                  <td>{tdata.to_date}</td>
                  <td>{tdata.teacher_first_name} {tdata.teacher_last_name}</td>

                  <td>
                    <Button className='noback-button' style={{background:'transparent', border:'none'}} data-testid="start-game-button">
                    <span className="nav-link" style={{ color: '#a6d22c', textDecoration: 'none', fontWeight: 'bold' }}
                     onClick={() => handleStartGame(tdata.id)}> 
                     <i class="bi bi-controller"></i>
                    </span></Button>
                    </td>
                  <td>
                    <Button className='noback-button' style={{background:'transparent', border:'none'}}>
                     <Link to={`/test/${tdata.id}`} className="nav-link" 
                      style={{ color: '#a6d22c', textDecoration: 'none', fontWeight: 'bold' }}>
                      <i class="bi bi-clipboard-check"></i>
                     </Link>
                   </Button>
                  </td>
                </tr>
              )))}
            </tbody>
          </Table>
          )}

        </CardBody>
      </Card>
    </div>
  );
};

export default Starter;