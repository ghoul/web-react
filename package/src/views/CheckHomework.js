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
import Cookies from "js-cookie";
import axios from 'axios';

export default function CheckHomework() {
    const { homeworkId } = useParams();
    const [homework, setHomework] = useState([]);
    const [edit, setEdit] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const token = Cookies.get('token'); 
  const navigate  = useNavigate();
  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/homework/${homeworkId}/`, {
          headers: {
            'Authorization' : `Token ${token}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
          },
        });
        
        console.log(response.data);
        setHomework(response.data);
        setEdit(response.data.edit);
        
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
    {homework.pairs && homework.pairs.map((pair, index) => (
        <Card key={index} className="mb-3">
          <CardBody>
            <Row>
              <Col>
            <CardTitle tag="h5">{index + 1}. {pair.question}</CardTitle>
            </Col><Col>
            <p><strong>Taškai:</strong> {pair.points}</p>
            </Col>
            </Row>

            {pair.qtype === 2 && (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <Label check>
                <Row>
                  <Col md={6}>
                    <Input
                      type="text"
                      readOnly
                      value={pair.answer}
                      style={{ width: '100%' }}
                    />
                  </Col>
                </Row>
              </Label>
            </div>
            )}

            {pair.qtype === 1 && (
              <>
                {pair.options.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <i
                      className={`bi ${pair.correct_options.some(correctOption => correctOption.option == option.id) ? 'bi-check-circle-fill' : 'bi-check-circle'}`}
                    ></i>
                    {"  "}{option.text}
                  </div>
                ))}
              </>
            )}

              {pair.qtype === 3 && (
              <>
                {pair.options.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <i
                      className={`bi ${pair.correct_options.some(correctOption => correctOption.option == option.id) ? 'bi-check-square-fill' : 'bi-check-square'}`}
                    ></i>
                    {"  "}{option.text}
                  </div>
                ))}
              </>
            )}
          </CardBody>
        </Card>
      ))}

              {edit && (<Button style={{ backgroundColor: 'orange', color: '#204963', border: 'none' }}>
                 <Link to={`/edit-homework/${homeworkId}`} className="nav-link" style={{ color: 'white' }}> Redaguoti</Link>
                 </Button>
                 )}
      </Col>
  
    </Row>
  );
};