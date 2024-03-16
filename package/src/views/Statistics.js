import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Col, Row } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import BACKEND_URL from '../layouts/config';
import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import user1 from "../assets/images/users/mrgoose.png";
import user2 from "../assets/images/users/msgoose.png";
import user3 from "../assets/images/users/user3.jpg";
import user4 from "../assets/images/users/user4.jpg";
import user5 from "../assets/images/users/user5.jpg";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
// import './Style.css';
const Statistics = () => {
  const {assignmentId} = useParams();
  const [students, setStudents] = useState([]);
  const [title, setTitle] = useState('');
  const [classs, setClasss] = useState('');
  // const [loggedId, setLoggedId] = useState('');
  const token = Cookies.get('token'); 
  //const decodedToken = jwtDecode(token);
  const userString = Cookies.get('user');
  const userData = JSON.parse(userString);
  const role = userData.role;
  const loggedId = userData.id;
  const navigate  = useNavigate();

  useEffect(() => {
    // Fetch homeworks data from your backend (assuming the endpoint is /api/homeworks)
    axios.get(`${BACKEND_URL}/assignment_statistics/${assignmentId}/`, {
        headers: {
          'Authorization' : `Token ${token}`,
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken')
        },
      }) // Replace with your actual endpoint
      .then(response => {
        console.log("title" + response.data.assignment.title);
        setStudents(response.data.assignment_results);
        setTitle(response.data.assignment.title);
        setClasss(response.data.assignment.class_title);
        //setLoggedId(response.data.id);
        console.log("loggedid: " + loggedId);
      })
      .catch(error => {
        console.error('Error fetching homeworks:', error);
      });
  }, []);

  const handleEdit = (id) => {
    // Handle edit button click
    console.log('Edit homework with ID:', id);
  };

  const handleDelete = (id) => {
    // Handle delete button click
    console.log('Delete homework with ID:', id);
  };

  const handleAssign = (id) => {
    // Handle assign button click
    console.log('Assign homework with ID:', id);
  };

  const send = (event) => {
    navigate(`/`);
  }

  const download = (event) => {
    const sortedData = students.sort((a, b) => a.surname.localeCompare(b.surname));
    const data = sortedData.map(student => `${student.surname} ${student.name}: ${student.grade}`).join('\n');
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const formattedTitle = title.toLowerCase().replace(/\s/g, '_');
    const today = new Date();
    const formattedDate = today.toISOString().slice(0,10); // Format: YYYY-MM-DD
    link.setAttribute('download', `${formattedTitle}_${classs}_${formattedDate}.txt`);
    document.body.appendChild(link);
    link.click();
  }

  console.log("loggedid2: " + loggedId);
  const typeOfData = typeof role;
  console.log(`The type of 'role' is: ${typeOfData}`);
  return (
    <div>
        <Row>
   <Card>
        <CardBody>
          <CardTitle tag="h5">
            {title}
            
            {role === 2 && (<Button  style={{
            backgroundColor: '#a6d22c',
            border: 'none',
            float: 'right', 
            marginBottom: '10px',
            color: 'white'
          }}
          onClick={download}>                        
                 <i class="bi bi-file-earmark-arrow-down"></i> Parsisiųsti
            </Button>
            )}
            </CardTitle>
          
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Namų darbo suvestinė
          </CardSubtitle>

          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th style={{textAlign: 'center'}}>Vieta</th>
                <th>Mokinys</th>
                <th>Būsena</th>
                <th>Data</th>
                <th>Atlikimo laikas</th>
                <th>Taškai</th>
                <th>Detaliau</th>
              </tr>
            </thead>
            <tbody>
              {students.map((tdata, index) => (
                <tr key={index} className="border-top">
                  {index + 1 <= 3 ? (
                  <td style={{textAlign: 'center'}}> 
                <img style={{width : '40px'}} src={`./place${index + 1}.png`} alt={`medal`} />
                </td>) : (
                  <td style={{textAlign: 'center'}}>
                <span ><strong>{index + 1}</strong></span>
                </td>
              )}
                  <td>
                    <div className="d-flex align-items-center p-2">
                      <img
                        src={tdata.student_gender === 1 ? user1 : user2}
                        className="rounded-circle"
                        alt="avatar"
                        width="45"
                        height="45"
                      />
                      <div className="ms-3">
                        <h6 className="mb-0">{tdata.student_first_name}</h6>
                        <span className="text-muted">{tdata.student_last_name}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    {tdata.status === "Bad" ? (
                      <span className="p-2 rounded-circle d-inline-block ms-3" style={{ backgroundColor: '#bf1a2f' }}></span> 
                    ) : tdata.status === "Average" ? (
                      <span className="p-2 rounded-circle d-inline-block ms-3"  style={{ backgroundColor: '#f3943c' }}></span> 
                    ) : (
                      <span className="p-2 rounded-circle d-inline-block ms-3" style={{ backgroundColor: '#a6d82b' }}></span>
                    )}
                  </td>
                  <td>{tdata.date}</td>                  
                  <td>{tdata.time}</td>
                  <td>{tdata.points}</td>
                  {((((role===2 || role ===3)|| tdata.student_id === loggedId ) && (tdata.status !== "Bad")) && <td><Button style={{backgroundColor: 'transparent', border: 'none'}}><Link to={`/statistics/${assignmentId}/${tdata.student_id}`} className="nav-link" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}> ➔➔ </Link></Button></td> )}
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
      <Col><Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button></Col>
      </Row>
    </div>
  );
};

export default Statistics;
