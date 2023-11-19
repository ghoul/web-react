import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

const AllHomework = () => {
  const [homeworks, setHomeworks] = useState([]);

  useEffect(() => {
    // Fetch homeworks data from your backend (assuming the endpoint is /api/homeworks)
    axios.get('/api/homeworks') // Replace with your actual endpoint
      .then(response => {
        setHomeworks(response.data);
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

  return (
    <div>
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Creation Date</th>
          <th>Number of Questions</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {homeworks.map(homework => (
          <tr key={homework.id}>
            <td>{homework.title}</td>
            <td>{homework.creationDate}</td>
            <td>{homework.numberOfQuestions}</td>
            <td>
              <button onClick={() => handleAssign(homework.id)}>Assign</button>
              <button onClick={() => handleEdit(homework.id)}>Edit</button>
              <button onClick={() => handleDelete(homework.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <Button style={{ backgroundColor: '#204963', marginRight: '10px' }}>
                  <Link to={`/create-homework`} className="nav-link" style={{ color: 'white' }}>
                    Pridėti naują
                  </Link>
                </Button>
                {/* <Button style={{ backgroundColor: 'orange', color: '#204963' }} onClick={() => showModalHandler(category.id)}>
                  Šalinti
                </Button> */}
    </div>
  );
};

export default AllHomework;
