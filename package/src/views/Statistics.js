import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Col, Row } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';

import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import user1 from "../assets/images/users/user1.jpg";
import user2 from "../assets/images/users/user2.jpg";
import user3 from "../assets/images/users/user3.jpg";
import user4 from "../assets/images/users/user4.jpg";
import user5 from "../assets/images/users/user5.jpg";
import { useNavigate } from 'react-router-dom';
const Starter = () => {
  const {assignmentId} = useParams();
  const [students, setStudents] = useState([]);
  const [title, setTitle] = useState([]);
  let token = localStorage.getItem('token'); 
  const navigate  = useNavigate();

  useEffect(() => {
    // Fetch homeworks data from your backend (assuming the endpoint is /api/homeworks)
    axios.get(`http://localhost:8000/get_assignment_statistics/${assignmentId}/`, {
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
                        src={user2}
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
                    {tdata.status === "bad" ? (
                      <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                    ) : tdata.status === "medium" ? (
                      <span className="p-2 bg-warning rounded-circle d-inline-block ms-3"></span>
                    ) : (
                      <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                    )}
                  </td>
                  <td>{tdata.date}</td>                  
                  <td>{tdata.time}</td>
                  <td>{tdata.points}</td>
                  {tdata.status !== "bad" && <td><Button><Link to={`/statistics/${assignmentId}/${tdata.id}`} className="nav-link" style={{ color: 'white' }}> → </Link></Button></td> }
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
