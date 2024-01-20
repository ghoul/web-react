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

export default function CheckHomework() {
    const { homeworkId } = useParams();
    const [homework, setHomework] = useState([]);
  const [showModal, setShowModal] = useState(false);
  let token = localStorage.getItem('token'); 
  const navigate  = useNavigate();
  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/handle_homework_id/${homeworkId}/`, {
          method: 'GET',
          headers: {
            'Authorization' : `${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setHomework(data.homework);
      } catch (error) {
        console.error('Error fetching Homework:', error);
      }
    };

    fetchHomework();
  }, []);

  const send = (event) => {
    navigate(`/all-homework`);
  }

  return (
    <Row>
      <Col>
        <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
        <Card>
        <CardBody>
      <CardTitle tag="h4" className="border-bottom text-left">
        {homework.title}
      </CardTitle>
      <CardSubtitle className="mb-2 text-muted text-left" tag="h6">
        Namų darbo peržiūra
      </CardSubtitle>
      </CardBody>
    </Card>
        {homework.pairs &&
          homework.pairs.map((pair, index) => (
            <Card key={index} className="mb-3">
              <CardBody>
                <CardTitle tag="h5"> {index + 1}. {pair.question}</CardTitle>              
                <p><strong>Atsakymas: </strong>{pair.answer}</p>
                <p><strong>Taškai: </strong>{pair.points}</p>
              </CardBody>
            </Card>
          ))}
              <Button style={{ backgroundColor: 'orange', color: '#204963' }}>
                 <Link to={`/edit-homework/${homeworkId}`} className="nav-link" style={{ color: 'white' }}> Redaguoti</Link>
                 </Button>
      </Col>
  
    </Row>
  );
};