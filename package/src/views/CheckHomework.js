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

export default function CheckHomework() {
    const { homeworkId } = useParams();
    const [homework, setHomework] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState(null);
  let token = localStorage.getItem('token'); 
  const navigate  = useNavigate();
  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/handle_homework_id/${homeworkId}`, {
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
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-info-circle me-2"></i>
            Homework Details
          </CardTitle>
          <CardBody>
            <Table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Homework Name</td>
                  <td>{homework.title}</td>
                </tr>
                <tr>
                  <td>Questions and Answers</td>
                  <td>
                    <ul>
                      {homework.pairs &&
                        homework.pairs.map((pair, index) => (
                          <li key={index}>
                            <strong>Question {index + 1}: </strong>
                            {pair.question}
                            <br />
                            <strong>Answer {index + 1}: </strong>
                            {pair.answer}
                            <br />
                            <strong>Points {index + 1}: </strong>
                            {pair.points}
                          </li>
                        ))}
                    </ul>
                  </td>
                </tr>
                {/* Display other fields or details of the homework */}
              </tbody>
            </Table>
            <Button style={{ backgroundColor: 'orange', color: '#204963' }}>
                <Link to={`/edit-homework/${homeworkId}`} className="nav-link" style={{ color: 'white' }}> Redaguoti</Link>
                </Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};