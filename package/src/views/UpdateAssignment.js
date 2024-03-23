import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import BACKEND_URL from '../layouts/config.js';
import {Row, Col, Card, CardTitle, CardBody, Button, Form, FormGroup, Label, Input} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import './Style.css';
import Cookies from "js-cookie";
import axios from "axios";
export default function UpdateAssignment() {
   const { assignmentId } = useParams();
   const navigate  = useNavigate();
   const [message, setMessage] = useState(''); 
   const [title, setTitleInput] = useState('');
   const [fromDateInput, setFromDateInput] = useState('');
   const [toDateInput, setToDateInput] = useState('');
   const [classInput, setClassInput] = useState(''); 
 
   const token = Cookies.get('token'); 
 
   const getAssignment = () => {
    axios.get(
      `${BACKEND_URL}/assignments/${assignmentId}/`,
      {
        headers: {
          'Authorization' : `Token ${token}`,
          "Content-Type": "application/json",
          'X-CSRFToken': Cookies.get('csrftoken')
        },
      }
    )
    .then((response) =>  {
      setFromDateInput(response.data.from_date);
      setToDateInput(response.data.to_date);
      setTitleInput(response.data.homework_title);
      setClassInput(response.data.classs);    
    });
  };

   useEffect(() => { 
    getAssignment();
   }, []);
   const saveAssignment = async (event) => {
     event.preventDefault();
     if (new Date(fromDateInput) >= new Date(toDateInput)) {
      setMessage('Klaida! Pradžios data turi būti ankstesnė nei pabaigos data.');
      return;
    }
     const assignment = {
         from_date : fromDateInput,
         to_date : toDateInput,
         classs : classInput
      };

      try {
      const response = await axios.put(`${BACKEND_URL}/assignments/${assignmentId}/`, assignment, {
      headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken')
        }
      });
      if (response.status === 200) {
          setMessage('Operacija sėkminga!');
      }
      setTimeout(() => {
          setMessage('');
      }, 3000);
    }
    catch (error){
      if (error.response && error.response.data && error.response.data.error) {
        setMessage('Klaida! ' + error.response.data.error);
      } else {
          setMessage('Klaida!');
      }
    }
   };
   
   const send = (event) => {
     navigate(`/`);
   }
   return (
     <Row>
       <Col>
       <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
         <Card>
           <CardTitle tag="h6" className="border-bottom p-3 mb-0">
           <i class="bi bi-calendar2-check me-2"></i>
             Namų darbo redagavimas
           </CardTitle>
           <CardTitle tag="h4" className="border-bottom p-3 mb-0">
          {title}
           </CardTitle>
           <CardBody>
           {message && <div style={{ marginBottom: '10px', color: message.includes('Klaida') ? 'red' : 'green' }}>{message}</div>}
             <Form onSubmit={saveAssignment}>
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
               <Button style={{ backgroundColor: '#a6d22c', color: 'white', border:'none' }}>Išsaugoti</Button>
             </Form>
           </CardBody>
         </Card>
       </Col>
     </Row>
   );
}
