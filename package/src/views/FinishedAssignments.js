import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button , Col} from 'reactstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
const FinishedAssignments = () => {
  const [homeworkTeacher, setHomeworkTeacher] = useState([]);
  const [homeworkStudent, setHomeworkStudent] = useState([]);
  let token = localStorage.getItem('token'); 
  //TODO: is token role ir pagal ja rodyt
  const navigate  = useNavigate();
  useEffect(() => {
    // Fetch homeworks data from your backend (assuming the endpoint is /api/homeworks)
    axios.get(`http://localhost:8000/handle_assignments_teacher_finished/`, {
      method: 'GET',
      headers: {
        'Authorization' : `${token}`,
        'Content-Type': 'application/json',
      },
    }) // Replace with your actual endpoint
      .then(response => {
        setHomeworkTeacher(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching homeworks:', error);
      });

      axios.get(`http://localhost:8000/handle_assignments_student_finished/`, {
      method: 'GET',
      headers: {
        'Authorization' : `${token}`,
        'Content-Type': 'application/json',
      },
    }) // Replace with your actual endpoint
      .then(response => {
        setHomeworkStudent(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching homeworks:', error);
      });
  }, []);
  const send = (event) => {
    navigate(`/`);
  }
  return (
    <div>
        <Col> <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button></Col>
   <Card>
        <CardBody>
          <CardTitle tag="h5">Užbaigti namų darbai</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Statistika
          </CardSubtitle>

          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>Pavadinimas</th>
                <th>Pradžios data</th>
                <th>Pabaigos data</th>
                <th>Klasė</th>
                <th>Būsena</th>
                <th>Detaliau</th>
              </tr>
            </thead>
            <tbody>
            {homeworkTeacher.length === 0 ? (
          <tr>
            <td colSpan="6">Užbaigtų namų darbų nėra</td>
          </tr>
            ) : (
              homeworkTeacher.map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>{tdata.title}</td>
                  <td>{tdata.fromDate}</td>
                  <td>{tdata.toDate}</td>
                  <td>{tdata.classs}</td>
                  <td>
                    {tdata.status === "bad" ? (
                      <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                    ) : tdata.status === "medium" ? (
                      <span className="p-2 bg-warning rounded-circle d-inline-block ms-3"></span>
                    ) : (
                      <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                    )}
                  </td>
                  <td> <Button><Link to={`/statistics/${tdata.id}`} className="nav-link" style={{ color: 'white' }}> → </Link></Button></td>
                </tr>
            )))}
            </tbody>
          </Table>


          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>Pavadinimas</th>
                <th>Pradžios data</th>
                <th>Pabaigos data</th>
                <th>Mokytojas</th>
                <th>Detaliau</th>
              </tr>
            </thead>
            <tbody>
            {homeworkStudent.length === 0 ? (
          <tr>
            <td colSpan="6">Užbaigtų namų darbų nėra</td>
          </tr>
            ) : (
              homeworkStudent.map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>{tdata.title}</td>
                  <td>{tdata.fromDate}</td>
                  <td>{tdata.toDate}</td>
                  <td>{tdata.teacher}</td>
                  <td> <Button><Link to={`/statistics/${tdata.id}`} className="nav-link" style={{ color: 'white' }}> → </Link></Button></td>
                </tr>
            )))}
            </tbody>
          </Table>

        </CardBody>
      </Card>
    </div>
  );
};

export default FinishedAssignments;