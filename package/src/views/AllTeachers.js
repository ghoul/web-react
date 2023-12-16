import React from "react";
import { Redirect } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
// import { useAlert } from "react-alert";
import { useLocation } from "react-router-dom";
import { useParams, Link } from 'react-router-dom';
import { Modal } from "./Modal.js";
import BACKEND_URL from '../layouts/config.js';
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

export default function AllTeachers() {
  const navigate  = useNavigate();
  const [message, setMessage] = useState(''); 
  const [showModal, setShowModal] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  const [teachers, setTeachers] = useState([]); 
  const [teachersConfirmed, setConfirmedTeachers] = useState([]); 
  const [teachersNotConfirmed, setNotConfirmedTeachers] = useState([]); 
  const [fail, setFail] = useState("");
  let token = localStorage.getItem('token'); 

  const getTeachers = () => {
    fetch(
      `${BACKEND_URL}/handle_teachers/`,
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
      setTeachers(data.teachers);
      console.log("grazino" + data);
    });
    fetch(
        `${BACKEND_URL}/handle_student_teachers/`,
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
        setConfirmedTeachers(data.teachers);
        console.log("grazino" + data);
      });
      fetch(
        `${BACKEND_URL}/get_not_confirmed_teachers/`,
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
        setNotConfirmedTeachers(data.teachers);
        console.log("grazino" + data);
      });
  };
  useEffect(() => {
    getTeachers();
  }, []);
  const addTeacher = (teacherId) => {
    console.log("teacherid: " + teacherId);
    const teacher = {
        teacher_id: teacherId,
      };
    fetch(`${BACKEND_URL}/handle_student_teachers/`, {
      method: 'POST',
      headers: {
        'Authorization' : `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teacher),
    })
    .then((response) => {
        if (response.ok) {
          const updatedTeachers = teachers.filter(teacher => teacher.id !== teacherId);
          setTeachers(updatedTeachers);
          hideModalHandler();
          getTeachers();
          console.log("pridejo teacher")
        } else {
          // Handle error scenario
          console.error('Failed to add teacher');
        }
      })
  };
  const cancelTeacher = () => {
    const teacher = {
        teacher_id: selectedTeacherId,
      };
    fetch(`${BACKEND_URL}/handle_student_teachers/`, {
      method: 'DELETE',
      headers: {
        'Authorization' : `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teacher),
    })
    .then((response) => {
        if (response.ok) {
          getTeachers();
          hideModalHandler();
          console.log("pridejo teacher")
        } else {
          // Handle error scenario
          console.error('Failed to add teacher');
        }
      })
  };

  const showModalHandler = (teacherId) => {
    setSelectedTeacherId(teacherId);
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
    <Modal show={showModal} hide={hideModalHandler} onRemoveProduct={cancelTeacher}></Modal>
    <Col>
    <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
            <Card>
            
              <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                <i class="bi bi-arrow-through-heart-fill me-2"></i>
                Laukiama patvirtinimo
              </CardTitle>
            </Card>
          </Col>
          <Table>
        <thead>
          <tr>
            <th>Vardas</th>
            <th>Pavardė</th>
            <th>Atšaukti</th>
          </tr>
        </thead>
        <tbody>
        {teachersNotConfirmed.length === 0 ? (
          <tr>
            <td colSpan="3">Užklausų nėra</td>
          </tr>
        ) : (
            teachersNotConfirmed.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.name}</td>
              <td>{teacher.surname}</td>
              <td>
                <Button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => showModalHandler(teacher.id)}>
                  X
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
                Mano mokytojai
              </CardTitle>
            </Card>
          </Col>
          <Table>
        <thead>
          <tr>
            <th>Vardas</th>
            <th>Pavardė</th>
          </tr>
        </thead>
        <tbody>
        {teachersConfirmed.length === 0 ? (
          <tr>
            <td colSpan="3">Mokytojų nėra</td>
          </tr>
        ) : (
            teachersConfirmed.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.name}</td>
              <td>{teacher.surname}</td>
            </tr>
          ))
        )}
      </tbody>
      </Table>
          <Col>
            <Card>
              <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                <i class="bi bi-arrow-through-heart-fill me-2"></i>
                Mokytojo pasirinkimas
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
        {teachers.length === 0 ? (
          <tr>
            <td colSpan="3">Daugiau mokytojų nėra</td>
          </tr>
        ) : (
          teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.name}</td>
              <td>{teacher.surname}</td>
              <td>
                <Button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => addTeacher(teacher.id)}>
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


