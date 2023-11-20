import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import user1 from "../assets/images/users/user1.jpg";
import user2 from "../assets/images/users/user2.jpg";
import user3 from "../assets/images/users/user3.jpg";
import user4 from "../assets/images/users/user4.jpg";
import user5 from "../assets/images/users/user5.jpg";

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
  const tableData = [
    {
      avatar: user1,
      name: "Hanna Gover",
      email: "hgover@gmail.com",
      project: "Flexy React",
      status: "pending",
      weeks: "35",
      budget: "95K",
    },
    {
      avatar: user2,
      name: "Hanna Gover",
      email: "hgover@gmail.com",
      project: "Lading pro React",
      status: "done",
      weeks: "35",
      budget: "95K",
    },
    {
      avatar: user3,
      name: "Hanna Gover",
      email: "hgover@gmail.com",
      project: "Elite React",
      status: "holt",
      weeks: "35",
      budget: "95K",
    },
    {
      avatar: user4,
      name: "Hanna Gover",
      email: "hgover@gmail.com",
      project: "Flexy React",
      status: "pending",
      weeks: "35",
      budget: "95K",
    },
    {
      avatar: user5,
      name: "Hanna Gover",
      email: "hgover@gmail.com",
      project: "Ample React",
      status: "done",
      weeks: "35",
      budget: "95K",
    },
  ];
  return (
    <div>
   <Card>
        <CardBody>
          <CardTitle tag="h5">Project Listing</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Overview of the projects
          </CardSubtitle>

          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>Team Lead</th>
                <th>Project</th>

                <th>Status</th>
                <th>Weeks</th>
                <th>Budget</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>
                    <div className="d-flex align-items-center p-2">
                      <img
                        src={tdata.avatar}
                        className="rounded-circle"
                        alt="avatar"
                        width="45"
                        height="45"
                      />
                      <div className="ms-3">
                        <h6 className="mb-0">{tdata.name}</h6>
                        <span className="text-muted">{tdata.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{tdata.project}</td>
                  <td>
                    {tdata.status === "pending" ? (
                      <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                    ) : tdata.status === "holt" ? (
                      <span className="p-2 bg-warning rounded-circle d-inline-block ms-3"></span>
                    ) : (
                      <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                    )}
                  </td>
                  <td>{tdata.weeks}</td>
                  <td>{tdata.budget}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
        {/* {homeworks.map(homework => (
          <tr key={homework.id}>
            <td>{homework.title}</td>
            <td>{homework.creationDate}</td>
            <td>{homework.numberOfQuestions}</td>
            <td>
              <button onClick={() => handleAssign(homework.id)}>Assign</button>
              <button onClick={() => handleEdit(homework.id)}>Edit</button>
              <button onClick={() => handleDelete(homework.id)}>Delete</button>
            </td>
          </tr> */}
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
