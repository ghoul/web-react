import React from "react";
import { Redirect } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
// import { useAlert } from "react-alert";
import { useLocation } from "react-router-dom";
import { useParams, Link } from 'react-router-dom';
import { Modal } from "./Modal.js";
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

export default function OneStudentStatistics() {
    const { assignmentId, studentId } = useParams();
    const [homework, setHomework] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState(null);
  let token = localStorage.getItem('token'); 
  const navigate  = useNavigate();
  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const response = await fetch(`http://localhost:8000/handle_homework_id/${assignmentId}/${studentId}/`, {
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
    navigate(`/statistics/${assignmentId}`);
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
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};