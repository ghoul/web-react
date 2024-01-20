import React from "react";
import { Redirect } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
// import { useAlert } from "react-alert";
import { useLocation } from "react-router-dom";
import { useParams, Link } from 'react-router-dom';
import { Modal } from "./Modal.js";
import BACKEND_URL from '../layouts/config.js';
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
  Input, Table, CardSubtitle
} from "reactstrap";
import { useNavigate } from 'react-router-dom';

export default function AssignmentTest() {
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState([]);
    const [title, setTitle] = useState('');
    const [initialized, setInitialized] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [startTime, setStartTime] = useState(null);
    //TODO: AR TIKRAI NORITE PATEIKTI?
  const [showModal, setShowModal] = useState(false);
  const [pairs, setPairs] = useState([]); //{questionId: 0, answer : ''}

//   const [title, setTitle] = useState(null);
  let token = localStorage.getItem('token'); 
  const navigate  = useNavigate();
  const generateInitialPairs = (count) => {
    return Array(count).fill({ questionId: 0, answer: '' });
  };
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        // const delayInMilliseconds = 1000;
        // await new Promise(resolve => setTimeout(resolve, delayInMilliseconds));
        const response = await fetch(`${BACKEND_URL}/handle_assignment_id/${assignmentId}/`, {
          method: 'GET',
          headers: {
            'Authorization' : `${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data);
        setAssignment(data.questions.pairs);
        setTitle(data.questions.title);
        const newPairs = data.questions.pairs.map(item => ({ questionId: item.qid, answer: '' }));
        setPairs(newPairs);
        console.log("PO VISKO!!!");

      } catch (error) {
        console.error('Error fetching Assignment:', error);
      }
    };

    fetchAssignment();
  }, []); 

  const handlePairChange = (index, field, value) => {
    const updatedPairs = [...pairs];
    updatedPairs[index][field] = value;
    console.log("field: " + field + " value: " + value);
    setPairs(updatedPairs);
  };

  useEffect(() => {
    setStartTime(performance.now());
  }, []);

  const saveAnswer = async (e) =>{
    e.preventDefault();
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    console.log(`Time elapsed: ${elapsedTime} milliseconds`);
    console.log("saveanswer");
    for (const element of pairs) {
        console.log(element.answer);
      }
    if (pairs.length > 0 && pairs.some(pair => pair.answer.trim() !== '')) {
      const formData = new FormData();
      formData.append('assignmentId', assignmentId);
      formData.append('time', elapsedTime);

      pairs.forEach((pair, index) => {
        formData.append(`pairs[${index}][questionId]`, pair.questionId);
        formData.append(`pairs[${index}][answer]`, pair.answer);
        console.log("answer: " + pair.answer);
        // if (pair.type === 'select') {
        //   formData.append(`pairs[${index}][correctOptionIndex]`, correctOptionIndexes[index]);
  
        //   pair.options.forEach((option, optionIndex) => {
        //       formData.append(`pairs[${index}][options][${optionIndex}]`, option);
        //       console.log("select: " + option);
        //   });
      
        // }
      });

      // Send formData to your backend (Django) using fetch or axios
      console.log('Data to be sent:', formData);
      // Perform further actions like API request
      try {

        console.log(formData.assignmentId);
        const response = await fetch(`${BACKEND_URL}/handle_test_answers/`, {
          method: 'POST',
          headers: {
            'Authorization': `${token}`,
          },
          body: formData, // Send formData directly
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log('Response from Django:', data);
          if (data.success) {
            setSuccessMessage(data.message); // Set the success message in state
          }
          // Handle other actions on successful submission
        } else {
          // Handle errors
          console.error('Failed to submit homework');
        
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert('Neatsakyta į visus klausimus');
    }
  }


  const send = (event) => {
    navigate(`/`);
  }

  return (
    <Row>
      <Col>
        <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
        <Card>
        <CardBody>
      <CardTitle tag="h4" className="border-bottom text-left">
        {title}
      </CardTitle>
      <CardSubtitle className="mb-2 text-muted text-left" tag="h6">
        Testas
      </CardSubtitle>
      </CardBody>
    </Card>
    <Form>
        {/* {true&&console.log(assignment)} */}
    {
  assignment.map((pair, index) => (
    <Card key={index} className="mb-3">
      <CardBody>
        <CardTitle tag="h5">{index + 1}. {pair.question}</CardTitle>
        <p>Taškai: {pair.points}</p>
        {console.log(pair.type)}
        {pair.type === 2 ? (
          <Input
            type="text"
            id={`question${index}`}
            defaultValue={''}
            onChange={(e) => handlePairChange(index, 'answer', e.target.value)}
          />
        ) : (
          <>
            {pair.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <Input
                  type="radio"
                  name={`correctOption${index}`}
                  // style={{ display: 'none' }}
                  // checked={correctOptionIndexes[index] === optionIndex}
                 
                  onChange={(e) => handlePairChange(index, 'answer', option.text)}
                />
                {option.text}
              </div>
            ))}
          </>
        )}

        
      </CardBody>
      
    </Card>
    
          ))}
          <Button type="button" style={{ backgroundColor: '#a6d22c', color: 'white', border:'none' }} onClick={saveAnswer}>Pateikti</Button>
              </Form>
      </Col>
  
    </Row>
  );
};