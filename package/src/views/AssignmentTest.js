import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams} from 'react-router-dom';
import BACKEND_URL from '../layouts/config.js';
import './Style.css';
import {Row, Col, Card, CardTitle, CardBody, Button, Form, CardSubtitle, Input} from 'reactstrap'; 
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import axios from 'axios';
import { Modal } from './Modal.js';
export default function AssignmentTest() {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [startTime, setStartTime] = useState(null);
    
  const [showModal, setShowModal] = useState(false);
  const [pairs, setPairs] = useState([]); 
  const [multipleChoices, setmultipleChoices] = useState([]); 

  const token = Cookies.get('token'); 
  const userString = Cookies.get('user');
  const userData = JSON.parse(userString);
  const userId = userData.id;
  const navigate  = useNavigate();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/test/${assignmentId}/`, {
          headers: {
            'Authorization' : `Token ${token}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
          },
        });
       
        setAssignment(response.data);
        setTitle(response.data[0].homework_title);
        const newPairs = response.data.map(item => ({ questionId: item.id, answer: '' }));
        setPairs(newPairs);

      } catch (error) {
        console.error('Klaida:', error);
      }
    };

    fetchAssignment();
  }, []); 

  const handlePairChange = (index, field, value) => {
    const updatedPairs = [...pairs];
    const updatedChoices = [...multipleChoices];
    if(field==="multiple")
    {
      const existingIndex = updatedChoices.findIndex(
        (entry) => entry.question === index && entry.option === value
      );
  
      if (existingIndex !== -1) {
        updatedChoices.splice(existingIndex, 1);
      } else {
        updatedChoices.push({ question: index, option: value });
      }
      setmultipleChoices(updatedChoices);
    }
    else{
      updatedPairs[index][field] = value;
      setPairs(updatedPairs);
    }
  };

  useEffect(() => {
    setStartTime(performance.now());
  }, []);

  const saveAnswer = async (e) =>{
    e.preventDefault();
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    if (pairs.length > 0 ) {
      const formData = new FormData();
      formData.append('time', elapsedTime);
      pairs.forEach((pair, index) => {
        formData.append(`pairs[${index}][questionId]`, pair.questionId);
        if (pair.answer === '') {
            var count = 0;
            multipleChoices.forEach((indexes, ind) =>{
            if(indexes.question === index)
            {
              formData.append(`pairs[${index}][multipleIndex][${count}]`, indexes.option);
              count+=1;
            }       
          })             
        }
        else {
          formData.append(`pairs[${index}][answer]`, pair.answer);        
        }
      });

      try{
        const response = await axios.post(`${BACKEND_URL}/test/${assignmentId}/`, formData, {
          headers: {
            'Authorization': `Token ${token}`,
            'X-CSRFToken': Cookies.get('csrftoken')
          }
        });
    
        if (response.status == 201) {
          navigate(`/statistics/${assignmentId}/${userId}`);
        }
      } catch (error) {
          console.error("Klaida: " + error);
          if (error.response && error.response.data && error.response.data.error) {
            setMessage('Klaida! ' + error.response.data.error);
          } else {
              setMessage('Klaida!');
          }
      }
  }
  else {
    alert('Neatsakyta į visus klausimus');
  }
}
 
const showModalHandler = () => {
  setShowModal(true);
};

const hideModalHandler = () => {
  setShowModal(false);
};

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
      {message && <div style={{ color: message.includes('Klaida') ? 'red' : 'green' }}>{message}</div>}
      </CardBody>
    </Card>
    <Modal question="Ar tikrai norite pateikti?" show={showModal} hide={hideModalHandler} onConfirm={saveAnswer}></Modal>
    <Form>
    
    {
  assignment.map((pair, index) => (
    <Card key={index} className="mb-3">
      <CardBody>
        <CardTitle tag="h5">{index + 1}. {pair.question}</CardTitle>
        <p>Taškai: {pair.points}</p>

        {pair.qtype === 2 && (
          <Input
            type="text"
            id={`question${index}`}
            data-testid={`question${index}`}
            defaultValue={''}
            onChange={(e) => handlePairChange(index, 'answer', e.target.value)}
          />
        ) }
        {pair.qtype === 1 && (
          <>
            {pair.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <Input
                  type="radio"
                  data-testid={`question${index}option${optionIndex}`}
                  name={`correctOption${index}`}                
                  onChange={(e) => handlePairChange(index, 'answer', option.id)}
                />
                {" " + option.text}
              </div>
            ))}
          </>
        )}

          {pair.qtype === 3 && (
          <>
            {pair.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <Input
                  type="checkbox"
                  data-testid={`question${index}option${optionIndex}`}
                  name={`multipleOption${index}`}
                  onChange={(e) => handlePairChange(index, 'multiple', option.id)}
                />
                {" " + option.text}
              </div>
            ))}
          </>
        )}
      </CardBody>
    </Card>
    
          ))}
          <Button type="button" style={{ backgroundColor: '#a6d22c', color: 'white', border:'none' }} onClick={showModalHandler}>Pateikti</Button>
      </Form>
    </Col>
  </Row>
  );
};