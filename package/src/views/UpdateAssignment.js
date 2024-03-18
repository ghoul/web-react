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
import axios from "axios";
export default function UpdateAssignment() {
   //get_classes_by_teacher
   const { assignmentId } = useParams();
   const navigate  = useNavigate();
   const [message, setMessage] = useState(''); 
   console.log("id: ", assignmentId);
   const [title, setTitleInput] = useState('');
   const [homework, setHomeworkInput] = useState('');
   const [fromDateInput, setFromDateInput] = useState('');
   const [toDateInput, setToDateInput] = useState('');
   const [classInput, setClassInput] = useState(''); 
 
   const [classes, setClasses] = useState([]); 
   const [assignment, setAssignment] = useState({}); 
   const [fail, setFail] = useState("");
   const token = Cookies.get('token'); 
 
  //  const getClasses = () => {
  //    axios.get(
  //      `${BACKEND_URL}/classes/`,
  //      {
  //        headers: {
  //          'Authorization' : `Token ${token}`,
  //          Accept: "application/json",
  //          "Content-Type": "application/json",
  //          'X-CSRFToken': Cookies.get('csrftoken')
  //        },
  //      }
  //    )
  //    .then((response) => {
  //     console.log("grazino klases");
  //      setClasses(response.data);
  //    });
  //  };
   //TODO: VEIKE PRIES AKIMIRKA, restart kompa?
   const getAssignment = () => {
    axios.get(
      `${BACKEND_URL}/assignments/${assignmentId}/`,
      {
        headers: {
          'Authorization' : `Token ${token}`,
          //  Accept: "application/json",
          "Content-Type": "application/json",
          'X-CSRFToken': Cookies.get('csrftoken')
        },
      }
    )
    .then((response) =>  {
      console.log("grazino assignment");
        console.log(response.data);
      setAssignment(response.data);
      setFromDateInput(response.data.from_date);
      setToDateInput(response.data.to_date);
      setHomeworkInput(response.data.homework);
      setTitleInput(response.data.homework_title);
      setClassInput(response.data.classs);    
     // console.log("grazino ass class" + data.data.classs);
    });
  };

   useEffect(() => { 
    //getClasses();
    getAssignment();
   }, []);
   const saveAssignment = (event) => {
     event.preventDefault();
     console.log("classid: " + classInput);
     console.log("from: " + fromDateInput);
     console.log("to: " + toDateInput);
     const assignment = {
         from_date : fromDateInput,
         to_date : toDateInput,
         classs : classInput
       };
       axios.put(`${BACKEND_URL}/assignments/${assignmentId}/`, assignment, {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        }
    })
    .then(response => {
        if (response.status !== 200) {
            throw new Error('HTTP error ' + response.status);
        }
    })
    .then(data => {
        // Handle response data if needed
        setMessage('Operacija sėkminga!');
        setTimeout(() => {
            setMessage('');
        }, 3000);
    })
    .catch(error => {
        console.error(error);
        setMessage('Klaida!' + error.message);
    });
    
    //    axios.patch(`${BACKEND_URL}/assignments/${assignmentId}/`, assignment, {
    //     headers: {
    //       'Authorization': `Token ${token}`,
    //       'Content-Type': 'application/json',
    //       'X-CSRFToken': Cookies.get('csrftoken')
    //     },
    //   })
    //  .then((response) => {
    //   console.log(response);
    //      if  (response.status !== 200) {
    //        throw new Error('HTTP error ' + response.satatus);
    //      }
    //      //return response.json();
    //    else{
    //      setMessage( 'Operacija sėkminga!');
    //      setTimeout(() => {
    //        setMessage('');
    //      }, 3000);
    //    }})
    //    .catch((error) => {
    //      console.error(error);
    //      setMessage('Klaida!' + error.error);
    //    });
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
