import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import BACKEND_URL from '../layouts/config.js';
import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import { Modal } from "./Modal.js";
import { jwtDecode } from 'jwt-decode';
import './Style.css';
import { useAuth } from '../views/AuthContext';
import Cookies from 'js-cookie';

const Starter = () => {
  const [homeworkTeacher, setHomeworkTeacher] = useState([]);
  const [homeworkStudent, setHomeworkStudent] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  // const [user_id, setUserid] =useState('');
  const { isLoggedIn } = useAuth();
  const token = Cookies.get('token'); 
  const userString = Cookies.get('user');
  var userData = userString ? JSON.parse(userString) : ''
  let user_email = "";
  let role = "";
  let user_id = "";
  if(userData!=null)
  {
    //const decodedToken = jwtDecode(token);
    user_email = userData.email; //decodedToken.email;
    role = userData.role; //decodedToken.role;
   user_id = userData.id;
  }


  const navigate  = useNavigate();
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
        console.log(response.data);
        setHomeworkTeacher(response.data);
      })
      .catch(error => {
        console.error('Error fetching homeworks:', error);
      });
    } else if (role === 1){
      axios.get(`${BACKEND_URL}/assignments_student/`, {
      headers: {
        'Authorization' : `Token ${token}`,
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken')
      },
    }) // Replace with your actual endpoint
      .then(response => {
        console.log(response.data);
        setHomeworkStudent(response.data);
      })
      .catch(error => {
        console.error('Error fetching homeworks:', error);
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

  const deleteAssignment = () => {
    console.log("assid: " + selectedAssignmentId);

    axios.delete(`${BACKEND_URL}/assignments_teacher/${selectedAssignmentId}/`, {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        },
    })
    .then(response => {
        // Handle success response
        hideModalHandler();
        getAssignments();
        console.log("Assignment deleted successfully");
    })
    .catch(error => {
        // Handle error
        console.error('Failed to delete assignment:', error);
    });
};

  
  const handleStartGame = async (assignmentId) => {
    try {    
        //console.log("user_id; " + user_id);
        const url = `http://localhost:8080/?student_id=${user_id}&assignment_id=${assignmentId}`; // Replace with the desired URL
        window.open(url, '_blank');
        //window.location.href = 'http://localhost:8080'; // Assuming the game is served at this URL
        console.log("startino zaidima");
    } catch (error) {
      // Handle any network-related errors
      console.error('Network error:', error);
    }
  };

  return (
    <div>
   <Card>
   <Modal show={showModal} hide={hideModalHandler} onRemoveProduct={deleteAssignment}></Modal>
        <CardBody>
          <CardTitle tag="h5">Aktyvūs namų darbai</CardTitle>
          {role === 2 && (
          <>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Statistika
          </CardSubtitle>

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
                  {/* TODO: Į ŽAIDIMĄ LINKAS */}
                  <td>  <Button className='noback-button' style={{background:'transparent', border:'none'}}>
                    <span className="nav-link" style={{ color: '#a6d22c', textDecoration: 'none', fontWeight: 'bold' }}
                     onClick={() => handleStartGame(tdata.id)}> 
                     <i class="bi bi-controller"></i>
                      </span></Button></td>

                  <td>  <Button className='noback-button' style={{background:'transparent', border:'none'}}>
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
      {/* <Button className="more-button" style={{background:'#a6d22c', border:'none'}} >
  <Link to={`/finished-assignments`} className="nav-link" style={{ color: 'white' }}>Užbaigti namų darbai →</Link>
</Button> */}
    </div>
  );
};

export default Starter;