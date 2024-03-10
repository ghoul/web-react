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
import './Style.css';
import Cookies from "js-cookie";
export default function UpdateAssignment() {
   //get_classes_by_teacher
   const { assignmentId } = useParams();
   const navigate  = useNavigate();
   const [message, setMessage] = useState(''); 
   console.log("id: ", assignmentId);
   const [fromDateInput, setFromDateInput] = useState('');
   const [toDateInput, setToDateInput] = useState('');
   const [classInput, setClassInput] = useState(''); 
 
   const [classes, setClasses] = useState([]); 
   const [assignment, setAssignment] = useState({}); 
   const [fail, setFail] = useState("");
   const token = Cookies.get('token'); 
 
   const getClasses = () => {
     fetch(
       `${BACKEND_URL}/get_classes_by_school/`,
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
       setClasses(data);
       //if(data.length>0) setClassInput(data[0].id); 
    //    console.log("grazino " + data[0].id);
     });
   };
   const getAssignment = () => {
    fetch(
      `${BACKEND_URL}/handle_assignment_update/${assignmentId}/`,
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
        console.log(data.data);
      setAssignment(data.data);
      setFromDateInput(data.data.fromDate);
      setToDateInput(data.data.toDate);
      console.log(data.data.title);
      setClassInput(data.data.classs);    
      console.log("grazino ass class" + data.data.classs);
    });
  };
   useEffect(() => { 
    getClasses();
    getAssignment();
   }, []);
   const saveAssignment = (event) => {
     event.preventDefault();
     console.log("classid: " + classInput);
     console.log("from: " + fromDateInput);
     console.log("to: " + toDateInput);
     const assignment = {
         fromDate : fromDateInput,
         toDate : toDateInput,
         class : classInput
       };
     fetch(`${BACKEND_URL}/handle_assignment_update/${assignmentId}/`, {
       method: 'PUT',
       headers: {
         'Authorization' : `${token}`,
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(assignment),
     })
     .then((response) => {
         if (!response.ok) {
           throw new Error('HTTP error ' + response.satatus);
         }
         return response.json();
       })
       .then((data) => {
         console.log('Response Body: ', data);
         setMessage(data.success ? 'Operacija sėkminga!' : 'Klaida! '+ data.error);
         setTimeout(() => {
           setMessage('');
         }, 3000);
       })
       .catch((error) => {
         console.error(error);
         setMessage('Klaida!' + error.error);
       });
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
          {assignment.title}
           </CardTitle>
           <CardBody>
           {message && <div style={{ marginBottom: '10px', color: message.includes('Klaida') ? 'red' : 'green' }}>{message}</div>}
             <Form onSubmit={saveAssignment}>
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
               {/* <FormGroup>
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
               </FormGroup> */}
               <Button style={{ backgroundColor: '#a6d22c', color: 'white', border:'none' }}>Išsaugoti</Button>
             </Form>
           </CardBody>
         </Card>
       </Col>
     </Row>
   );
}
