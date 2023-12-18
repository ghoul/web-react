import React from "react";
import { Redirect } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
// import { useAlert } from "react-alert";
import { useLocation } from "react-router-dom";
import { useParams, Link } from 'react-router-dom';
import { Modal } from "./Modal.js";
import './Style.css';
// import Forms from "./ui/Forms";
import {
  Card,
  Row,
  Col,
  CardTitle,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input, Table
} from "reactstrap";
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../layouts/config.js';

export default function AddStudents() {
  const navigate  = useNavigate();
  const [message, setMessage] = useState(''); 
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [students, setStudents] = useState([]); 
  const [notConfirmedStudents, setNotConfirmedStudents] = useState([]); 
  const [fail, setFail] = useState("");
  let token = localStorage.getItem('token'); 

  const getStudents = () => {
    fetch(
      `${BACKEND_URL}/handle_teacher_students/`,
      {
        method: "GET",
        headers: {
          'Authorization' : `${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => response.json())
    .then((data) => {
      setStudents(data.students);
      console.log("grazino" + data);
    });

  fetch(
    `${BACKEND_URL}/get_not_confirmed_students/`,
    {
      method: "GET",
      headers: {
        'Authorization' : `${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  )
  .then((response) => response.json())
  .then((data) => {
    setNotConfirmedStudents(data.students);
    console.log("grazino not c" + data);
  });
  };
  useEffect(() => {
    getStudents();
  }, []);
  const addStudent = (studentId) => {
    console.log("studentid: " + studentId);
    const student = {
        student_id: studentId,
      };
    fetch(`${BACKEND_URL}/handle_teacher_students/`, {
      method: 'POST',
      headers: {
        'Authorization' : `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    })
    .then((response) => {
        if (response.ok) {
        //   const updatedNotConfirmedStudents = notConfirmedStudents.filter(student => student.id !== studentId);
        //   setNotConfirmedStudents(updatedNotConfirmedStudents);
          hideModalHandler();
          getStudents();
          console.log("pridejo studenta");
        } else {
          // Handle error scenario
          console.error('Failed to add student');
        }
      })
      // .catch(error => {
      //   // Handle error
      //   //window.location.reload();
      //   console.error('Error deleting classs:', error);
      // });
  };
  const removeStudent = () => {
    console.log("studentid: " + selectedStudentId);
    const student = {
        student_id: selectedStudentId,
      };
    fetch(`${BACKEND_URL}/handle_students/`, {
      method: 'DELETE',
      headers: {
        'Authorization' : `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    })
    .then((response) => {
        if (response.ok) {
        //   const updatedNotConfirmedStudents = notConfirmedStudents.filter(student => student.id !== studentId);
        //   setNotConfirmedStudents(updatedNotConfirmedStudents);
          hideModalHandler();
          getStudents();
          console.log("pasalino studenta");
        } else {
          // Handle error scenario
          console.error('Failed to add student');
        }
      })
  };
  const rejectStudent = (studentId) => {
    console.log("studentid: " + studentId);
    const student = {
        student_id: studentId,
      };
    fetch(`${BACKEND_URL}/handle_teacher_students/`, {
      method: 'DELETE',
      headers: {
        'Authorization' : `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    })
    .then((response) => {
        if (response.ok) {
        //   const updatedNotConfirmedStudents = notConfirmedStudents.filter(student => student.id !== studentId);
        //   setNotConfirmedStudents(updatedNotConfirmedStudents);
          hideModalHandler();
          getStudents();
          console.log("pridejo studenta");
        } else {
          // Handle error scenario
          console.error('Failed to add student');
        }
      })
  };

  const showModalHandler = (studentId) => {
    setSelectedStudentId(studentId);
    setShowModal(true);
  };

  const hideModalHandler = () => {
    setShowModal(false);
  };
  const send = (event) => {
    navigate(`/`);
  }
  return (
    <div>
        <Row>
        <Modal show={showModal} hide={hideModalHandler} onRemoveProduct={removeStudent}></Modal>
          <Col>
          <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
            </Col>
            <Card>
              <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              <i class="bi bi-patch-question-fill me-2"></i>
                Mokinių užklausos
              </CardTitle>
           
        
          <Table>
        <thead>
          <tr>
            <th>Vardas</th>
            <th>Pavardė</th>
            <th style={{textAlign:'center'}}>Patvirtinti / Atmesti</th>
            {/* <th>Atmesti</th> */}
          </tr>
        </thead>
        <tbody>
        {notConfirmedStudents.length === 0 ? (
          <tr className="border-top">
          <td colSpan="4" style={{ textAlign: 'center', fontStyle: 'italic', color: '#888' }}>Mokinių užklausų nėra</td>
          </tr>
        ) : (
            notConfirmedStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.surname}</td>
              <td style={{textAlign:'center'}}>
                <Button style={{ marginRight: '5px', backgroundColor: '#a6d22c', color: 'white', border:'none',  borderRadius: '50%', width:'40px', height:'40px' }} onClick={() => addStudent(student.id)}>
                <i class="bi bi-patch-plus"></i>
                </Button>
                {/* </td>
                <td> */}
                <Button style={{  marginLeft: '5px', backgroundColor: '#bf1a2f', color: 'white', border:'none',borderRadius: '50%', width:'40px', height:'40px' }} onClick={() => rejectStudent(student.id)}> 
                {/* TODO: showModaHandler */}
                <i class="bi bi-patch-minus"></i>
                </Button>
                </td>
              
            </tr>
          ))
        )}
      </tbody>
      </Table>
      </Card>
      
            <Card>
              <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              <i class="bi bi-check-circle-fill me-2"></i>
                Patvirtinti mokiniai
              </CardTitle>
            
     
          <Table>
        <thead>
          <tr>
            <th>Vardas</th>
            <th>Pavardė</th>
            <th>Šalinti</th>
          </tr>
        </thead>
        <tbody>
        {students.length === 0 ? (
         <tr className="border-top">
         <td colSpan="3" style={{ textAlign: 'center', fontStyle: 'italic', color: '#888' }}>Mokinių nėra</td>
          </tr>
        ) : (
          students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.surname}</td>
              <td>
                <Button style={{ backgroundColor: '#bf1a2f', color: 'white', border:'none' }} onClick={() => showModalHandler(student.id)}>
                <i class="bi bi-x-lg"></i>
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
      </Table>
      </Card>
        </Row>
      </div>
  );
}


//TODO: 
//visi mokiniai mokytojo pagal abėcėlę
//prie kiekvieno salinti
//virsuj uzklausos - patvirtinti/atmesti