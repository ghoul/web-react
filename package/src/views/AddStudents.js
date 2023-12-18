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
  const { classsId } = useParams();
  const navigate  = useNavigate();
  const [message, setMessage] = useState(''); 
  console.log("id: ", classsId);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [students, setStudents] = useState([]); 
  const [fail, setFail] = useState("");
  let token = localStorage.getItem('token'); 
  

  const getStudents = (classsId) => {
    fetch(
      `${BACKEND_URL}/handle_teacher_class/${classsId}/`,
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
  };
  useEffect(() => {
    const id = classsId;
    getStudents(id);
  }, []);
  const addStudent = (studentId) => {
    console.log("studentid: " + studentId);
    const student = {
        id: studentId,
      };
    fetch(`${BACKEND_URL}/handle_teacher_class/${classsId}/`, {
      method: 'POST',
      headers: {
        'Authorization' : `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    })
    .then((response) => {
        if (response.ok) {
          const updatedStudents = students.filter(student => student.id !== studentId);
          setStudents(updatedStudents);
          hideModalHandler();
          console.log("pridejo studenta")
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
  

  const showModalHandler = (studentId) => {
    setSelectedStudentId(studentId);
    setShowModal(true);
  };

  const hideModalHandler = () => {
    setShowModal(false);
  };
  const send = (event) => {
    navigate(`/edit-class/${classsId}`);
  }
  return (
    <div>
    <Row>
          <Col>
          <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
            <Card>
              <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                <i class="bi bi-arrow-through-heart-fill me-2"></i>
                Naujo mokinio pridėjimas į klasę
              </CardTitle>
            </Card>
          </Col>
          <Table>
        <thead>
          <tr>
            <th>Vardas</th>
            <th>Pavardė</th>
            <th>Pridėti</th>
          </tr>
        </thead>
        <tbody>
        {students.length === 0 ? (
          <tr>
            <td colSpan="3">Daugiau mokinių nėra</td>
          </tr>
        ) : (
          students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.surname}</td>
              <td>
                <Button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => addStudent(student.id)}>
                  +
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


