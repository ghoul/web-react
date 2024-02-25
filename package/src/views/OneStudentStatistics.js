import React, { useState, useEffect } from "react";
import { Button, Card, CardTitle, CardBody, Row, Col, CardSubtitle,Table , Label, Input} from "reactstrap";
import { useNavigate, useParams } from 'react-router-dom';
import BACKEND_URL from '../layouts/config.js';


export default function OneStudentStatistics() {
  const { assignmentId, studentId } = useParams();
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [questionsCount, setQuestionsCount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [totalPoints, setTotalPoints] = useState('');
  const [gotPoints, setGotPoints] = useState('');
  const [grade, setGrade] = useState('');
  const navigate = useNavigate();
  let token = localStorage.getItem('token');
 let tempGrade = 0;

  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/get_one_student_answers/${assignmentId}/${studentId}/`, {
          method: 'GET',
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data);
        setResults(data.results);
        setTitle(data.title);
        setName(data.name);
        setQuestionsCount(data.questions);
        const totalPoints = data.results.reduce((sum, result) => sum + result.opoints, 0);
        setTotalPoints(totalPoints);
        const gotPoints = data.results.reduce((sum, result) => sum + result.points, 0);
        setGotPoints(gotPoints);
        if(totalPoints>0) 
        {
          tempGrade = Math.ceil((gotPoints * 10) / totalPoints);
        }
        else{
          tempGrade=0;
        }
        const cappedGrade = tempGrade > 10 ? 10 : tempGrade;
        setGrade(cappedGrade);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchHomework();
  }, []);

  const send = () => {
    navigate(`/statistics/${assignmentId}`);
  };

  const calculateCorrectAnswers = () => {
    const correctAnswers = results.filter(pair => pair.answer === pair.student_answer);
    return correctAnswers.length;
  };
  const calculatePercentage = () => {
    const correct = calculateCorrectAnswers();
    const percentage = (correct / questionsCount) * 100;
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
      {calculateCorrectAnswers()}/{questionsCount}
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
                style={{
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '80px',
                  height: '80px',
                  color: 'white',
                  fontSize: '40px'
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
                <CardTitle tag="h5"> {index + 1}. {pair.question}</CardTitle> 
                </Col>
                <Col>
                <p className="card-text">
                        <strong>Taškai: </strong>
                        {pair.points}/{pair.opoints}
                    </p>
                </Col>
                </Row>
                {pair.qtype===2 && (     
                  <>      
                 <div key={index} >
                              <Label check>
                                <Row><Col  md={7}>
                                <Input
                                  type="text"
                                  readOnly
                                  value={pair.answer}
                                  style={{ width: '100%' }}
                                />
                                <p>{''}</p></Col></Row>
                              </Label>
                            </div>

                            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                <Label check>
                                  <Row>
                                    <Col md={6}>
                                      <Input
                                        type="text"
                                        readOnly
                                        value={pair.student_answer}
                                        style={{ width: '100%' }}
                                      />
                                    </Col>
                                    <Col md={6} className="d-flex align-items-center ">
                                      {pair.student_answer === pair.answer ? (
                                        <span className="text-success"><i className="bi bi-check-lg"></i></span>
                                      ) : (
                                        <span className="text-danger"><i className="bi bi-x-lg"></i></span>
                                      )}
                                    </Col>
                                  </Row>
                                </Label>
                              </div>
                     
                    </>
                  )}  
                  {pair.qtype === 1 && (
                    <>      
                    {pair.all_options.map((option, index) => (
                            <div key={index} style={{ whiteSpace: 'pre' }}>
                              <Label check>
                                <Input
                                  type="radio"
                                  name={`correctOption${index}`}
                                  checked={pair.student_answer.includes(option)}
                                  readOnly
                                />
                                {'  '} {option} {" "}
                                {pair.student_answer.includes(option) && pair.answer.includes(option) && (
                                  <span className="text-success"><i class="bi bi-check-lg"></i></span>
                                )}
                                { pair.student_answer.includes(option) && !pair.answer.includes(option) && (
                                  <span className="text-danger"><i class="bi bi-x-lg"></i></span>
                                )}
                                {!pair.student_answer.includes(option) && pair.answer.includes(option) && (
                                  <span className="text-success"><i class="bi bi-check-lg"></i></span>
                                )}
                              </Label>
                            </div>
                          ))}
                      
                    </>
                  )}

                  {pair.qtype === 3 && (     
                    <>      
                      {pair.all_options.map((option, index) => (
                          <div key={index} style={{ whiteSpace: 'pre' }}>
                            <Label check>
                              <Input
                                type="checkbox"
                                checked={pair.student_answer.includes(option)}
                                readOnly
                              />
                                {'  '} {option} {' '}
                                {pair.student_answer.includes(option) && pair.answer.includes(option) && (
                                  <span className="text-success"><i class="bi bi-check-lg"></i></span>
                                )}
                                { pair.student_answer.includes(option) && !pair.answer.includes(option) && (
                                  <span className="text-danger"><i class="bi bi-x-lg"></i></span>
                                )}
                                {!pair.student_answer.includes(option) && pair.answer.includes(option) && (
                                  <span className="text-success"><i class="bi bi-check-lg"></i></span>
                                )}
                            </Label>
                          </div>
                        ))}
                    </>
                  )}

                              
              </CardBody>
            </Card>
          ))}
      </Col>
  
    </Row>
  );
};