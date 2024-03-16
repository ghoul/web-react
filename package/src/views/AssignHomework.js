import React from "react";
import { Redirect } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
// import { useAlert } from "react-alert";
import { useLocation } from "react-router-dom";
import { useParams, Link } from 'react-router-dom';
import { Modal } from "./Modal.js";
import axios from 'axios';
// import Forms from "./ui/Forms";
import BACKEND_URL from '../layouts/config.js';
import './Style.css';
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
import Cookies from "js-cookie";
export default function AssignHomework() {

    //get_classes_by_teacher
    const { homeworkId } = useParams();
  const navigate  = useNavigate();
  const [message, setMessage] = useState(''); 
  console.log("id: ", homeworkId);
  const [fromDateInput, setFromDateInput] = useState('');
  const [toDateInput, setToDateInput] = useState('');
  const [classInput, setClassInput] = useState(''); 

  const [classes, setClasses] = useState([]); 
  const [fail, setFail] = useState("");
  let token = Cookies.get('token'); 

  const getClasses = async() => {
    try {
      const response = await  axios.get(`${BACKEND_URL}/classes/`, {
          headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
              'X-CSRFToken': Cookies.get('csrftoken')
          },
      });
      if (response.status !== 200) {
          throw new Error('HTTP error ' + response.status);
      }
      console.log(response.data);
      setClasses(response.data);
      setClassInput(response.data[0].id)
  } catch (error) {
      console.error(error);
      // Handle error here
  }
  };
  useEffect(() => {
    getClasses();
  }, []);
  const assignHomework = async (event) => {
    event.preventDefault();
    try {
      const response = await  axios.post(`${BACKEND_URL}/assignments/`, {
        homework: homeworkId,
        from_date: fromDateInput,
        to_date: toDateInput,
        classs: classInput
    }, {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        }
    });
      if (response.status !== 201) {
          throw new Error('HTTP error ' + response.status);
      }
      setMessage(response.status===201 ? 'Operacija sėkminga!' : 'Klaida! ' + response.error);
  } catch (error) {
      console.error(error);
      // Handle error here
  }
  };
  
  const send = (event) => {
    navigate(`/all-homework`);
  }
  return (
    <Row>
      <Col>
      <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          <i class="bi bi-calendar-plus-fill me-2"></i>
            Namų darbų skyrimas
          </CardTitle>
          <CardBody>
          {message && <div style={{ marginBottom: '10px', color: message.includes('Klaida') ? 'red' : 'green' }}>{message}</div>}
            <Form onSubmit={assignHomework}>
               {/* {% csrf_token %} */}
               <Row>
                <Col>
              <FormGroup>
                <Label for="from_date">Pradžios data</Label>
                <Input
                  id="from_date"
                  name="from_date"
                  type="date"
                  style={{ height: '30px' }}
                  required
                  value={fromDateInput}
                  onChange={(e) => setFromDateInput(e.target.value)}
                />
              </FormGroup>
              </Col>
              <Col>
              <FormGroup>
                <Label for="to_date">Pabaigos data</Label>
                <Input
                  id="to_date"
                  name="to_date"
                  type="date"
                  style={{ height: '30px' }}
                  required
                  value={toDateInput}
                  onChange={(e) => setToDateInput(e.target.value)}
                />
              </FormGroup>
              </Col>
              </Row>
              <FormGroup>
                <Label for="classs">Klasė</Label>
                <Input
                  id="classs"
                  name="classs"
                  type="select"
                  required
                  value={classInput}
                  onChange={(e) => setClassInput(e.target.value)}
                >
                   {classes.length > 0 ? ( // Check if classes is not empty
                classes.map((classs) => (
                  <option key={classs.id} value={classs.id}>
                    {classs.title}
                  </option>
                ))
              ) : (
                <option value="">Nėra klasių</option>
              )}
                </Input>
              </FormGroup>
              <Button   style={{ backgroundColor: '#a6d22c', color: 'white', border:'none' }}>Paskirti</Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}