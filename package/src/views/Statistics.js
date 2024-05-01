import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Col, Row } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import BACKEND_URL from '../layouts/config';
import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import user1 from "../assets/images/users/mrgoose.png";
import user2 from "../assets/images/users/msgoose.png";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
// import './Style.css';
const Statistics = () => {
  const {assignmentId} = useParams();
  const [students, setStudents] = useState([]);
  const [title, setTitle] = useState('');
  const [classs, setClasss] = useState('');
  const token = Cookies.get('token'); 
  const userString = Cookies.get('user');
  const userData = JSON.parse(userString);
  const role = userData.role;
  const loggedId = userData.id;
  const navigate  = useNavigate();

  useEffect(() => {
    axios.get(`${BACKEND_URL}/assignment_statistics/${assignmentId}/`, {
        headers: {
          'Authorization' : `Token ${token}`,
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken')
        },
      })
      .then(response => {
        setStudents(response.data.assignment_results);
        setTitle(response.data.assignment.title);
        setClasss(response.data.assignment.class_title);
      })
      .catch(error => {
        console.error('Klaida:', error);
      });
  }, []);

  const send = (event) => {
    if(role===1){
      navigate(`/finished-assignments`)
    } else{
      navigate(`/`);
    }
  }

  const download = (event) => {
    const sortedData = students.sort((a, b) => a.student_last_name.localeCompare(b.student_last_name));
    const longestNameLength = sortedData.reduce((max, student) => Math.max(max, student.student_last_name.length + student.student_first_name.length), 0);
    const formattedData = sortedData.map(student => {
      const name = `${student.student_last_name} ${student.student_first_name}`;
      const spacing = ' '.repeat(longestNameLength - name.length + 3);
      return `${name}${spacing}${student.grade}`;
    }).join('\n');
    const header = `Mokinys${' '.repeat(longestNameLength-6)}Pažymys\n`;
    const border = '-'.repeat(header.length+2) + '\n';
    const table = `${header}${border}${formattedData}`;
    const blob = new Blob([table], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const formattedTitle = title.toLowerCase().replace(/\s/g, '_');
    const today = new Date();
    const formattedDate = today.toISOString().slice(0,10);
    link.setAttribute('download', `${formattedTitle}_${classs}_${formattedDate}.txt`);
    document.body.appendChild(link);
    link.click();
  }
  
  
  return (
    <div>
      <Row>
        <Card>
        <CardBody>
          <CardTitle tag="h5">
            {title}
            {role === 2 && (<Button  style={{backgroundColor: '#a6d22c',border: 'none',float: 'right', marginBottom: '10px', color: 'white'}}
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
                        <h6 className="mb-0"> {tdata.student_first_name || tdata.first_name}</h6>
                        <span className="text-muted">{tdata.student_last_name || tdata.last_name}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    {tdata.status === "Good" ? (
                      <span className="p-2 rounded-circle d-inline-block ms-3" style={{ backgroundColor: '#a6d82b' }}></span>
                      
                    ) : tdata.status === "Average" ? (
                      <span className="p-2 rounded-circle d-inline-block ms-3"  style={{ backgroundColor: '#f3943c' }}></span> 
                    ) : (
                      <span className="p-2 rounded-circle d-inline-block ms-3" style={{ backgroundColor: '#bf1a2f' }}></span> 
                    )}
                  </td>
                  <td>{tdata.date}</td>                  
                  <td>{tdata.time.slice(0, 8)}</td>
                  <td>{tdata.points}</td>
                  {((((role===2 || role ===3)|| tdata.student === loggedId ) && (tdata.status !== "Bad")) && <td><Button style={{backgroundColor: 'transparent', border: 'none'}}><Link to={`/statistics/${assignmentId}/${tdata.student}`} className="nav-link" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}> ➔➔ </Link></Button></td> )}
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
