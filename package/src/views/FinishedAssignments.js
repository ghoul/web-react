import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button , Col} from 'reactstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../layouts/config';
import './Style.css';
import Cookies from 'js-cookie';
import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
const FinishedAssignments = () => {
  const [homeworkTeacher, setHomeworkTeacher] = useState([]);
  const [homeworkStudent, setHomeworkStudent] = useState([]);
  const token = Cookies.get('token'); 
  const userString = Cookies.get('user');
  const userData = JSON.parse(userString);
  let role = userData.role;
  const navigate  = useNavigate();

  useEffect(() => {
    if(role === 2){
    axios.get(`${BACKEND_URL}/assignments_teacher_finished/`, {
      headers: {
        'Authorization' : `Token ${token}`,
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken')
      },
    }) 
      .then(response => {
        setHomeworkTeacher(response.data);
      })
      .catch(error => {
        console.error('Klaida:', error);
      });
    } else if (role === 1){
      axios.get(`${BACKEND_URL}/assignments_student_finished/`, {
      headers: {
        'Authorization' : `Token ${token}`,
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken')
      },
    })
      .then(response => {
        setHomeworkStudent(response.data);
      })
      .catch(error => {
        console.error('Klaida:', error);
      });
    }
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

          {role===2 && (<Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>Pavadinimas</th>
                <th>Pradžios data</th>
                <th>Pabaigos data</th>
                <th>Klasė</th>
                <th>Būsena</th>
                <th>Detaliau</th>
                <th>Pratęsti</th>
              </tr>
            </thead>
            <tbody>
            {homeworkTeacher.length === 0 ? (
          <tr className="border-top">
          <td colSpan="6" style={{ textAlign: 'center', fontStyle: 'italic', color: '#888' }}>Užbaigtų namų darbų nėra</td>
          </tr>
            ) : (
              homeworkTeacher.map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>{tdata.homework_title}</td>
                  <td>{tdata.from_date}</td>
                  <td>{tdata.to_date}</td>
                  <td>{tdata.classs_title}</td>
                  <td>
                    {tdata.status === "Bad" ? (
                      <span className="p-2 rounded-circle d-inline-block ms-3" style={{ backgroundColor: '#bf1a2f' }}></span> 
                    ) : tdata.status === "Average" ? (
                      <span className="p-2 rounded-circle d-inline-block ms-3"  style={{ backgroundColor: '#f3943c' }}></span> 
                    ) : (
                      <span className="p-2 rounded-circle d-inline-block ms-3" style={{ backgroundColor: '#a6d82b' }}></span>
                    )}
                  </td>
                  <td> <Button style={{backgroundColor: 'transparent', border:'none'}}><Link to={`/statistics/${tdata.id}`} className="nav-link" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}> ➔➔ </Link></Button></td>
                  <td><Button className='noback-button' style={{background:'transparent', border:'none'}}>
                <Link to={`/assignment/edit/${tdata.id}`} className="nav-link" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}> <i class="bi bi-calendar-plus"></i></Link>
                  </Button></td>
                </tr>
            )))}
            </tbody>
          </Table>)}

          {role===1 && (<Table className="no-wrap mt-3 align-middle" responsive borderless>
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
          <tr className="border-top">
          <td colSpan="6" style={{ textAlign: 'center', fontStyle: 'italic', color: '#888' }}>Užbaigtų namų darbų nėra</td>
          </tr>
            ) : (
              homeworkStudent.map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>{tdata.homework_title}</td>
                  <td>{tdata.from_date}</td>
                  <td>{tdata.to_date}</td>
                  <td>{tdata.teacher_first_name} {tdata.teacher_last_name}</td>
                  <td> <Button style={{backgroundColor: 'transparent', border:'none'}}><Link to={`/statistics/${tdata.id}`} className="nav-link" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}> ➔➔ </Link></Button></td>
                </tr>
            )))}
            </tbody>
          </Table>)}

        </CardBody>
      </Card>
    </div>
  );
};

export default FinishedAssignments;