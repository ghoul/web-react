import React from "react";
import { Redirect } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
// import { useAlert } from "react-alert";
import { useLocation } from "react-router-dom";
import { useParams, Link } from 'react-router-dom';
import { Modal } from "./Modal.js";
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
            <Card>
              <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                <i class="bi bi-arrow-through-heart-fill me-2"></i>
                Mokinių užklausos
              </CardTitle>
            </Card>
          </Col>
          <Table>
        <thead>
          <tr>
            <th>Vardas</th>
            <th>Pavardė</th>
            <th>Patvirtinti</th>
            <th>Atmesti</th>
          </tr>
        </thead>
        <tbody>
        {notConfirmedStudents.length === 0 ? (
          <tr>
            <td colSpan="4">Mokinių užklausų nėra</td>
          </tr>
        ) : (
            notConfirmedStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.surname}</td>
              <td>
                <Button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => addStudent(student.id)}>
                  +
                </Button>
                </td>
                <td>
                <Button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => rejectStudent(student.id)}> 
                {/* TODO: showModaHandler */}
                  -
                </Button>
                </td>
              
            </tr>
          ))
        )}
      </tbody>
      </Table>
      <Col>
            <Card>
              <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                <i class="bi bi-arrow-through-heart-fill me-2"></i>
                Patvirtinti mokiniai
              </CardTitle>
            </Card>
          </Col>
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
          <tr>
            <td colSpan="3">Mokinių nėra</td>
          </tr>
        ) : (
          students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.surname}</td>
              <td>
                <Button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => showModalHandler(student.id)}>
                  X
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
      </Table>
        </Row>
      </div>
  );
}


//TODO: 
//visi mokiniai mokytojo pagal abėcėlę
//prie kiekvieno salinti
//virsuj uzklausos - patvirtinti/atmesti