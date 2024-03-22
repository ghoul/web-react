// src/components/Podium.js
import podium1 from '../assets/images/podium1.png'; // Import your podium images
import podium2 from '../assets/images/podium2.png';
import podium3 from '../assets/images/podium3.png';

import user1 from '../assets/images/users/mrgoose.png'; // Import your podium images
import user2 from '../assets/images/users/msgoose.png';


import styles from './Podium.module.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import BACKEND_URL from '../layouts/config.js';
import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import { Modal } from "./Modal.js";
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../views/AuthContext';
import Cookies from 'js-cookie';
const Podium = () => {
  const [podiumTeacher, setHomeworkTeacher] = useState([]);
  const [podiumStudents, setPodiumStudent] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [classs, setClasss] =useState('');
  const { isLoggedIn } = useAuth();
  const token = Cookies.get('token'); 
  const userString = Cookies.get('user');
  const userData = JSON.parse(userString);
  let user_email = "";
  let role = "";
  if(token!=null)
  {
    //const decodedToken = jwtDecode(token);
    user_email = userData.email;
    role = userData.role;
  }
  const navigate  = useNavigate();
  const getPodium = () => {
    axios.get(`${BACKEND_URL}/class_statistics/`, {
      headers: {
        'Authorization' : `Token ${token}`,
        'Content-Type': 'application/json, charset=utf-8',
        'X-CSRFToken': Cookies.get('csrftoken')
      },
    }) // Replace with your actual endpoint
      .then(response => {
        console.log(response.data.leaderboard);
        // const parsedPodiumStudents = JSON.parse(response.data.leaderboard);
        setPodiumStudent(response.data.leaderboard);
        setClasss(response.data.class_title);
      })
      .catch(error => {
        console.error('Error fetching podium:', error);
      });

    //   axios.get(`${BACKEND_URL}/handle_assignments_student/`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization' : `${token}`,
    //     'Content-Type': 'application/json',
    //   },
    // }) // Replace with your actual endpoint
    //   .then(response => {
    //     setHomeworkStudent(response.data.data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching homeworks:', error);
    //   });
  };
  useEffect(() => {
   getPodium();
  }, []);

  const renderPodiumUser = (user, index) => (
    <div key={index} className={`${styles.podium} ${styles[`podium-${index + 1}`]}`}>
      <div>
      {index === 0 && (
          <img
          src={user.gender === 1 ? `./pplace1.png` : `./pplace1m.png`}
          alt={user.student}
          className="rounded-circle"
          width="120"
        />
        )}
        {index === 1 && (
          <img
          src={user.gender === 1 ? `./pplace2.png` : `./pplace2m.png`}
          alt={user.student}
          className="rounded-circle"
          width="120"
        />
        )}
          {index === 2 && (
          <img
          src={user.gender === 1 ? `./pplace3.png` : `./pplace3m.png`}
          alt={user.student}
          className="rounded-circle"
          width="120"
        />
        )}
      </div>
      <img style={{marginTop: '7px',  width : "150px"}} src={`./podium${index + 1}.png`} alt={`Podium ${index + 1}`} />
      <div className={styles['user-profile']}>

        <p class="points-paragraph" style={{ backgroundColor: 'rgba(191, 26, 47, 0.8)', color: 'white', borderRadius: '10px', padding: '7px' }}><strong>
          {`${user.student}`}
          </strong></p>
        <p class="points-paragraph">{user.points}xp</p>
      </div>
    </div>
  );
  
  

  const renderListUsers = (students) => (
    <Table className="no-wrap mt-3 align-middle" responsive borderless>
    <thead>
      <tr>
        <th>Vieta</th>
        <th>Mokinys</th>      
        <th>Taškai</th>
      </tr>
    </thead>
    <tbody>
      {students.map((tdata, index) => (
        <tr key={index} className="border-top">
          <td>{index+4}.</td>
          <td>{tdata.student}</td>
          <td>{tdata.points}</td>
        </tr>
      ))}
    </tbody>
  </Table>
  );


  const renderUsers = () => {
    const topUsers = podiumStudents.slice(0, 3);
    const restUsers = podiumStudents.slice(3);

    return (
      <div className={styles['podium-container']}>
        <div className={styles['podium-wrapper']}>
          {topUsers.map((user, index) => renderPodiumUser(user, index))}
        </div>
        <div className={styles['list-container']}>
          {renderListUsers(restUsers)}
        </div>
      </div>
    );
  };

return (
  <div>
    <center><h2>{classs} klasės lyderių lentelė</h2></center>
    {renderUsers()}
  </div>
);
};

export default Podium;
