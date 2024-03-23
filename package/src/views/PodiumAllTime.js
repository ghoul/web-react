import styles from './Podium.module.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BACKEND_URL from '../layouts/config.js';
import { Table } from "reactstrap";
import Cookies from 'js-cookie';

const Podium = () => {
  const [podiumStudents, setPodiumStudent] = useState([]);
  const [classs, setClasss] =useState('');
  const token = Cookies.get('token'); 

  const getPodium = () => {
    axios.get(`${BACKEND_URL}/class_statistics/`, {
      headers: {
        'Authorization' : `Token ${token}`,
        'Content-Type': 'application/json, charset=utf-8',
        'X-CSRFToken': Cookies.get('csrftoken')
      },
    })
      .then(response => {
        setPodiumStudent(response.data.leaderboard);
        setClasss(response.data.class_title);
      })
      .catch(error => {
        console.error('Klaida:', error);
      });
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
