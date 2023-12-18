import React, { useState, useEffect } from "react";
import { Button, Card, CardTitle, CardBody, Row, Col, CardSubtitle,Table } from "reactstrap";
import { useNavigate, useParams } from 'react-router-dom';
import BACKEND_URL from '../layouts/config.js';
import './Style.css';

export default function OneStudentStatistics() {
  const { assignmentId, studentId } = useParams();
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [questionsCount, setQuestionsCount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  let token = localStorage.getItem('token');

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
          {/* <CardTitle tag="h3" className="border-bottom p-3 mb-0">
            {title} 
          </CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            {name}
          </CardSubtitle> */}
          <CardBody className="pt-0">
          <CardTitle tag="h3">{title}</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Namų darbo sprendimas
          </CardSubtitle>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5>
                  {name}
                  <span className="text-muted fs-6 ms-2">
                    Rezultatas: 
                    <span className={`rounded-circle p-2 ms-2 ${getColorClass()}`}>
                      {calculateCorrectAnswers()}/{questionsCount}
                    </span>
                  </span>
                </h5>
              </div>
            </div>
          </CardBody>
        </Card>
          {results.map((pair, index) => (
            <Card key={index} className="mb-3">
              <CardBody>
                <CardTitle tag="h5"> {index + 1}. {pair.question}</CardTitle>              
                <p className="card-text">
                                 <strong>Tikras atsakymas: </strong>
                                 <span className={`text-${pair.answer === pair.student_answer ? 'success' : 'danger'}`}>
                                   {pair.answer}
                                 </span>
                               </p>
                               <p className="card-text">
                                 <strong>Pateiktas atsakymas: </strong>
                                 <span className={`text-${pair.answer === pair.student_answer ? 'success' : 'danger'}`}>
                                   {pair.student_answer}
                                 </span>
                              </p>
                               <p className="card-text">
                                 <strong>Taškai: </strong>
                                 {pair.points}
                              </p>
              </CardBody>
            </Card>
          ))}
      </Col>
  
    </Row>
  );
  // return (
  //   <Row>
  //     <Col>
  //       <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
  //       <Card>
  //         <CardTitle tag="h6" className="border-bottom p-3 mb-0">
  //           <i className="bi bi-info-circle me-2"></i>
  //           Namų darbo rezultatai
  //         </CardTitle>
  //         <CardBody>
  //           <Table>
  //             <thead>
  //               <tr>
  //                 <th>Field</th>
  //                 <th>Value</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               <tr>
  //                 <td>Namų darbas: </td>
  //                 <td>{title}</td>
  //               </tr>
  //               <tr>
  //                 <td>Questions and Answers</td>
  //                 <td>
  //                   <Row xs="1" sm="2" md="2" lg="2" xl="2">
  //                     {results.map((pair, index) => (
  //                       <Col key={index} className="mb-4">
  //                         <Card>
  //                           <CardBody>
  //                             <h5 className="card-title">Question {index + 1}</h5>
  //                             <p className="card-text">Question: {pair.question}</p>
  //                             <p className="card-text">
  //                               <strong>Answer: </strong>
  //                               <span className={`text-${pair.answer === pair.student_answer ? 'success' : 'danger'}`}>
  //                                 {pair.answer}
  //                               </span>
  //                             </p>
  //                             <p className="card-text">
  //                               <strong>Student Answer: </strong>
  //                               <span className={`text-${pair.answer === pair.student_answer ? 'success' : 'danger'}`}>
  //                                 {pair.student_answer}
  //                               </span>
  //                             </p>
  //                             <p className="card-text">
  //                               <strong>Points: </strong>
  //                               {pair.points}
  //                             </p>
  //                           </CardBody>
  //                         </Card>
  //                       </Col>
  //                     ))}
  //                   </Row>
  //                 </td>
  //               </tr>
  //               {/* Display other fields or details of the homework */}
  //             </tbody>
  //           </Table>
  //         </CardBody>
  //       </Card>
  //     </Col>
  //   </Row>
  // );
};

// import React from "react";
// import { Redirect } from "react-router";
// import { useState } from "react";
// import { useEffect } from "react";
// // import { useAlert } from "react-alert";
// import { useLocation } from "react-router-dom";
// import { useParams, Link } from 'react-router-dom';
// import { Modal } from "./Modal.js";
// import BACKEND_URL from '../layouts/config.js';
// // import Forms from "./ui/Forms";
// import {
//   Card,
//   Row,
//   Col,
//   CardTitle,
//   CardBody,
//   Button,
//   Form,
//   FormGroup,
//   Label,
//   Input, Table
// } from "reactstrap";
// import { useNavigate } from 'react-router-dom';

// export default function OneStudentStatistics() {
//     const { assignmentId, studentId } = useParams();
//     const [results, setResults] = useState([]);
//     const [title, setTitle] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   let token = localStorage.getItem('token'); 
//   const navigate  = useNavigate();
//   useEffect(() => {
//     const fetchHomework = async () => {
//       try {
//         const response = await fetch(`${BACKEND_URL}/get_one_student_answers/${assignmentId}/${studentId}/`, {
//           method: 'GET',
//           headers: {
//             'Authorization' : `${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         const data = await response.json();
//         setResults(data.results);
//         setTitle(data.title);
//       } catch (error) {
//         console.error('Error fetching results:', error);
//       }
//     };

//     fetchHomework();
//   }, []);

//   const send = (event) => {
//     navigate(`/statistics/${assignmentId}`);
//   }

//   return (
//     <Row>
//       <Col>
//         <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
//         <Card>
//           <CardTitle tag="h6" className="border-bottom p-3 mb-0">
//             <i className="bi bi-info-circle me-2"></i>
//             Namų darbo rezultatai
//           </CardTitle>
//           <CardBody>
//             <Table>
//               <thead>
//                 <tr>
//                   <th>Field</th>
//                   <th>Value</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>Namų darbas: </td>
//                   <td>{title}</td>
//                 </tr>
//                 <tr>
//                   <td>Questions and Answers</td>
//                   <td>
//                     <div className="row">
//                       {results.length > 0 &&
//                         results.map((pair, index) => (
//                           <div key={index} className="col-md-12 mb-4">
//                             <div className="card">
//                               <div className="card-body">
//                                 <h5 className="card-title">Question {index + 1}</h5>
//                                 <p className="card-text">Question: {pair.question}</p>
//                                 <p className="card-text">
//                                   <strong>Answer: </strong>
//                                   <span className={`text-${pair.answer === pair.student_answer ? 'success' : 'danger'}`}>
//                                     {pair.answer}
//                                   </span>
//                                 </p>
//                                 <p className="card-text">
//                                   <strong>Student Answer: </strong>
//                                   <span className={`text-${pair.answer === pair.student_answer ? 'success' : 'danger'}`}>
//                                     {pair.student_answer}
//                                   </span>
//                                 </p>
//                                 <p className="card-text">
//                                   <strong>Points: </strong>
//                                   {pair.points}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                     </div>
//                   </td>
//                 </tr>
//                 {/* Display other fields or details of the homework */}
//               </tbody>
//             </Table>
//           </CardBody>
//         </Card>
//       </Col>
//     </Row>
//   );
// };