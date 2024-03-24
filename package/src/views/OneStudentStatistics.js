import React, { useState, useEffect } from "react";
import { Button, Card, CardTitle, CardBody, Row, Col, CardSubtitle, Label, Input} from "reactstrap";
import { useNavigate, useParams } from 'react-router-dom';
import BACKEND_URL from '../layouts/config.js';
import Cookies from "js-cookie";
import axios from "axios";

export default function OneStudentStatistics() {
  const { assignmentId, studentId } = useParams();
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [questionsCount, setQuestionsCount] = useState('');
  const [totalPoints, setTotalPoints] = useState('');
  const [gotPoints, setGotPoints] = useState('');
  const [grade, setGrade] = useState('');
  const [answered, setAnswered] = useState('0');
  const navigate = useNavigate();
  const token = Cookies.get('token'); 

 useEffect(() => {
  const fetchHomework = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/one_student_answers/${assignmentId}/${studentId}/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken')
        },
      });
      const data = response.data;
      
      if (data.results.length > 0) {
        setResults(data.results);
        setTitle(data.results[0].question.homework.title);
        var fullName = `${data.results[0].student.first_name} ${data.results[0].student.last_name}`;
        setName(fullName);
        setQuestionsCount(data.results.length);
        setTotalPoints(data.points);
        setGotPoints(data.score);
        setGrade(data.grade);
        const correctAnswers = data.results.filter(pair => pair.points === pair.question.points).length;
        setAnswered(correctAnswers);
      } else {
        console.error('Nėra informacijos');
      }
    } catch (error) {
      console.error('Klaida:', error);
    }
  };

  fetchHomework();
}, [assignmentId, studentId, token]);

  const send = () => {
    navigate(`/statistics/${assignmentId}`);
  };

  const calculatePercentage = () => {
    const percentage = (answered / questionsCount) * 100;
    return percentage;
  };

  const getColorClass = () => {
    const percentage = calculatePercentage();
    if (percentage <= 40) {
      return 'bg-danger';
    } else if (percentage > 40 && percentage <= 75) {
      return 'bg-warning';
    } else {
      return 'bg-success';
    }
  };

  return (
    <Row>
      <Col>
        <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
      
        <Card>
          <CardBody className="pt-0">
          <Row className="align-items-center" style={{ margin: '0', padding: '0' }}>

            <Col>
              <CardTitle tag="h3">{title}</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                Namų darbo sprendimas
              </CardSubtitle>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{name}</h5>
                </div>
              </div>
            </Col>

            <Col md={4} className="d-flex flex-column justify-content-between">
              <div className="d-flex flex-row align-items-center">
                <span className="flex-shrink-0 text-end me-2">Atsakymai:</span>
                <div className={`p-2 ${getColorClass()}`} style={{ width: '50px', borderRadius: '10px', color: 'white', textAlign: 'center' }}>
                  {answered}/{questionsCount}
                </div>
              </div>

              <div className="d-flex flex-row align-items-center mt-2">
                <span className="flex-shrink-0 text-end me-2">Taškai:</span>
                <div className={`p-2 ${getColorClass()}`} style={{ borderRadius: '10px', color: 'white',textAlign: 'center'  }}>
                  {gotPoints}/{totalPoints}
                </div>
              </div>
            </Col>


            <Col md={4} className="d-flex align-items-center justify-content-center">
            <span
                className={` points-paragraph rounded-circle p-2 ms-2 ${getColorClass()}`}
                style={{display: 'inline-flex',justifyContent: 'center',
                  alignItems: 'center',width: '80px', height: '80px',
                  color: 'white', fontSize: '40px'
                }}
              >
                {grade}
              </span>
            </Col>
          </Row>

          </CardBody>
        </Card>
          {results.map((pair, index) => (
            <Card key={index} className="mb-3">
              <CardBody>
                <Row> <Col>
                <CardTitle tag="h5"> {index + 1}. {pair.question.question}</CardTitle> 
                </Col>
                <Col>
                <p className="card-text">
                      <strong>Taškai: </strong>
                      {pair.points}/{pair.question.points}
                </p>
                </Col>
                </Row>
                {pair.question.qtype===2 && (     
                  <>      
                 <div key={index} >
                    <Row>
                      <Col md={4}>
                          <Input
                            type="text"
                            readOnly
                            value={pair.question.answer}
                            style={{ width: '100%' }}
                          />
                          <p>{''}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}> 
                        <Input
                          type="text"
                          readOnly
                          value={pair.answer}
                          style={{ width: '100%' }}
                        />
                      </Col>

                      <Col md={6} className="d-flex align-items-center ">
                        {pair.answer.toLowerCase() === pair.question.answer.toLowerCase() ? (
                          <span className="text-success"><i className="bi bi-check-lg"></i></span>
                        ) : (
                          <span className="text-danger"><i className="bi bi-x-lg"></i></span>
                        )}
                      </Col>

                    </Row>
                  </div> 
                     
                    </>
                  )}  

          {(pair.question.qtype === 1 || pair.question.qtype === 3) && (
            <>
            {pair.question.options.map((option, index) => {
                const filteredOptions = pair.selected_options.filter(selectedOption => (
                    selectedOption.student == studentId && selectedOption.question == pair.question.id && selectedOption.option == option.id
                ));

                const isSelected = filteredOptions.length > 0;
                return (
                    <div key={index} style={{ whiteSpace: 'pre' }}>
                        <Label check>
                            <Input
                                type={pair.question.qtype === 1 ? "radio" : "checkbox"}
                                checked={isSelected}
                                readOnly
                            />
                                  {'  '} {option.text} {" "}

                                  {isSelected && pair.question.correct_options.some(correctOption => correctOption.id === option.id) && (
                                      <span className="text-success"><i className="bi bi-check-lg"></i></span>
                                  )}
                                  {isSelected && !pair.question.correct_options.some(correctOption => correctOption.id === option.id) && (
                                      <span className="text-danger"><i className="bi bi-x-lg"></i></span>
                                  )}
                                  {!isSelected && pair.question.correct_options.some(correctOption => correctOption.id === option.id) && (
                                      <span className="text-success"><i className="bi bi-check-lg"></i></span>
                                  )}
                        </Label>
                    </div>
                      );
                  })}
              </>
          )}                         
            </CardBody>
          </Card>
        ))}
    </Col>
  
    </Row>
  );
};