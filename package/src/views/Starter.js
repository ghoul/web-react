import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import BACKEND_URL from '../layouts/config.js';
import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import { Modal } from "./Modal.js";
import './Style.css';
const Starter = () => {
  const [homeworkTeacher, setHomeworkTeacher] = useState([]);
  const [homeworkStudent, setHomeworkStudent] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  let token = localStorage.getItem('token'); 
  const navigate  = useNavigate();
  const getAssignments = () => {
    axios.get(`${BACKEND_URL}/handle_assignments_teacher/`, {
      method: 'GET',
      headers: {
        'Authorization' : `${token}`,
        'Content-Type': 'application/json',
      },
    }) // Replace with your actual endpoint
      .then(response => {
        setHomeworkTeacher(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching homeworks:', error);
      });

      axios.get(`${BACKEND_URL}/handle_assignments_student/`, {
      method: 'GET',
      headers: {
        'Authorization' : `${token}`,
        'Content-Type': 'application/json',
      },
    }) // Replace with your actual endpoint
      .then(response => {
        setHomeworkStudent(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching homeworks:', error);
      });
  };
  useEffect(() => {
    // Fetch homeworks data from your backend (assuming the endpoint is /api/homeworks)
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
    const assignment = {
        id: selectedAssignmentId,
      };
    fetch(`${BACKEND_URL}/handle_assignments_teacher/`, {
      method: 'DELETE',
      headers: {
        'Authorization' : `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assignment),
    })
    .then((response) => {
        if (response.ok) {
        //   const updatedNotConfirmedStudents = notConfirmedStudents.filter(student => student.id !== studentId);
        //   setNotConfirmedStudents(updatedNotConfirmedStudents);
          hideModalHandler();
          getAssignments();
          console.log("pasalino assignment");
        } else {
          // Handle error scenario
          console.error('Failed to add student');
        }
      })
  };
  return (
    <div>
   <Card>
   <Modal show={showModal} hide={hideModalHandler} onRemoveProduct={deleteAssignment}></Modal>
        <CardBody>
          <CardTitle tag="h5">Aktyvūs namų darbai</CardTitle>
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
                <th>Detaliau</th>
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
                  <td>{tdata.title}</td>
                  <td>{tdata.fromDate}</td>
                  <td>{tdata.toDate}</td>
                  <td>{tdata.classs}</td>
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
<td>
  <Button className='noback-button' style={{background:'transparent', border:'none'}} onClick={() => showModalHandler(tdata.id)}>
  ✖
  </Button>
</td>


                </tr>
              )))}
            </tbody>
          </Table>

          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>Pavadinimas</th>
                <th>Pradžios data</th>
                <th>Pabaigos data</th>
                <th>Mokytojas</th>
                <th>Pradėti</th>
              </tr>
            </thead>
            <tbody>
            {homeworkStudent.length === 0 ? (
              
        <tr className="border-top">
        <td colSpan="6" style={{ textAlign: 'center', fontStyle: 'italic', color: '#888' }}>Neatliktų namų darbų nėra</td>
      </tr>
      
            ) : (homeworkStudent.map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>{tdata.title}</td>
                  <td>{tdata.fromDate}</td>
                  <td>{tdata.toDate}</td>
                  <td>{tdata.teacher}</td>
                  {/* TODO: Į ŽAIDIMĄ LINKAS */}
                  <td> <Button><Link to={`/statistics/${tdata.id}`} className="nav-link" style={{ color: 'white' }}> → </Link></Button></td>
                </tr>
              )))}
            </tbody>
          </Table>

        </CardBody>
      </Card>
      <Button className="more-button" style={{background:'#a6d22c', border:'none'}} >
  <Link to={`/finished-assignments`} className="nav-link" style={{ color: 'white' }}>Užbaigti namų darbai →</Link>
</Button>
    </div>
  );
};

export default Starter;