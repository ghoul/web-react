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
import './Style.css';
const Starter = () => {
  const {assignmentId} = useParams();
  const [students, setStudents] = useState([]);
  const [title, setTitle] = useState([]);
  const [loggedId, setLoggedId] = useState('');
  let token = localStorage.getItem('token'); 
  const decodedToken = jwtDecode(token);
  const role = decodedToken.role;
  const navigate  = useNavigate();

  useEffect(() => {
    // Fetch homeworks data from your backend (assuming the endpoint is /api/homeworks)
    axios.get(`${BACKEND_URL}/get_assignment_statistics/${assignmentId}/`, {
        method: 'GET',
        headers: {
          'Authorization' : `${token}`,
          'Content-Type': 'application/json',
        },
      }) // Replace with your actual endpoint
      .then(response => {
        console.log("title" + response.title);
        setStudents(response.data.students);
        setTitle(response.data.title);
        setLoggedId(response.data.id);
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
  console.log("loggedid2: " + loggedId);
  const typeOfData = typeof role;
  console.log(`The type of 'role' is: ${typeOfData}`);
  return (
    <div>
        <Row>
   <Card>
        <CardBody>
          <CardTitle tag="h5">{title}</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Namų darbo suvestinė
          </CardSubtitle>

          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
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
                  <td>
                    <div className="d-flex align-items-center p-2">
                      <img
                        src={tdata.gender === 1 ? user1 : user2}
                        className="rounded-circle"
                        alt="avatar"
                        width="45"
                        height="45"
                      />
                      <div className="ms-3">
                        <h6 className="mb-0">{tdata.name}</h6>
                        <span className="text-muted">{tdata.surname}</span>
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
                  {((((role===2 || role ===3)|| tdata.id === loggedId ) && (tdata.status !== "Bad")) && <td><Button style={{backgroundColor: 'transparent', border: 'none'}}><Link to={`/statistics/${assignmentId}/${tdata.id}`} className="nav-link" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}> ➔➔ </Link></Button></td> )}
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

export default Starter;
