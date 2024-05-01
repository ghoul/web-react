import React, { useState, useEffect } from 'react';
import {Row, Col, Card, CardTitle, CardBody, Button, Form, FormGroup, Label, Input, Table, TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import { Modal } from './Modal.js';
import BACKEND_URL from '../layouts/config';
import './Style.css';
import Cookies from 'js-cookie';
import axios from 'axios';
const AdminSchool = () => {
  const [titleInput, setTitleInput] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [licenseInput, setLicenseInput] = useState('');

  const [licenseInputUpdate, setLicenseInputUpdate] = useState('');
  const [titleInputUpdate, setTitleInputUpdate] = useState('');
  const [fileInputUpdate, setFileInputUpdate] = useState(null);

  const [message, setMessage] = useState(''); 
  const [showModal, setShowModal] = useState(false);

  const [schools, setSchools]  = useState([]);
  const [schoolIdDelete, setSchoolIdDelete]  = useState(1);
  const [schoolIdUpdate, setSchoolIdUpdate]  = useState(1);

  const [activeTab, setActiveTab] = useState('add');

  let token = Cookies.get('token'); 
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  const fetchSchools = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/school/`, {
        headers: {
          'Authorization' : `Token ${token}`,
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken')
        },
      });
      const data = response.data;
      setSchools(data);
      setSchoolIdUpdate(data[0].id)
      setLicenseInputUpdate(data[0].license_end)
    } catch (error) {
      console.error('Klaida:', error);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const createSchool = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', titleInput);
    formData.append('file', fileInput);
    formData.append('license', licenseInput);

    try {
        const response = await fetch(`${BACKEND_URL}/school/`, {
            method: 'POST',
            headers: {
              'Authorization' : `Token ${token}`,
              'X-CSRFToken': Cookies.get('csrftoken')
            },
            body: formData,
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        const formattedTitle = titleInput + ".txt";
        a.download = `${formattedTitle}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setMessage(blob ? 'Operacija sėkminga!' : 'Klaida! ');
        fetchSchools();
        setTimeout(() => {
            setMessage('');
        }, 3000);
        
    } catch (error) {
        console.error("Klaida: " + error);
        if (error.response && error.response.data && error.response.data.error) {
          setMessage('Klaida! ' + error.response.data.error);
        } else {
            setMessage('Klaida!');
        }
    }
};
const updateSchool = async (event) => {
  event.preventDefault();
  const formData2 = new FormData();
  formData2.append('title', titleInputUpdate);
  formData2.append('file', fileInputUpdate);
  formData2.append('license', licenseInputUpdate);

  try {
      const response = await fetch(`${BACKEND_URL}/school/update/${schoolIdUpdate}/`, {
          method: 'POST',
          headers: {
            'Authorization' : `Token ${token}`,
            'X-CSRFToken': Cookies.get('csrftoken')
          },
          body: formData2,
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      var formattedTitleUpdate = '';
      if (titleInputUpdate.length > 0){
        formattedTitleUpdate = titleInputUpdate + ".txt";
      }
      else{
        console.log(schoolIdUpdate);
        console.log(schools);
        const selectedSchool = schools.find(s => s.id == schoolIdUpdate);
        console.log(selectedSchool);
        formattedTitleUpdate = selectedSchool.title + ".txt";
      }
      a.download = formattedTitleUpdate;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      fetchSchools();

      setMessage(blob ? 'Operacija sėkminga!' : 'Klaida! ');
      setTimeout(() => {
          setMessage('');
      }, 3000);
          
      
  } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        setMessage('Klaida! ' + error.response.data.error);
      } else {
          setMessage('Klaida!');
      }
  }
};

const deleteSchool = async (event) => {
  event.preventDefault();

  try {
      const response = await axios.delete(`${BACKEND_URL}/school/${schoolIdDelete}/`, {
          headers: {
              'Authorization' : `Token ${token}`,
              'Content-Type': 'application/json',
              'X-CSRFToken': Cookies.get('csrftoken')
          }
      });
        if(response.status != 204){
          if (response.data.error) {
             setMessage('Klaida! ' + response.data.error);
          } else {
            setMessage('Klaida!');
          }
        }
        fetchSchools();
        hideModalHandler(); 
  } catch (error) {
        console.error('Klaida:', error);
        if (error.response && error.response.data && error.response.data.error) {
          setMessage('Klaida! ' + error.response.data.error);
        } else {
            setMessage('Klaida!');
        }
  }
};
const handleSchoolChange = (selectedSchoolId) => {
  setSchoolIdUpdate(selectedSchoolId);
  const selectedSchool = schools.find(school => school.id == selectedSchoolId);
  if (selectedSchool) {
    setLicenseInputUpdate(selectedSchool.license_end);
  } else {
    setLicenseInputUpdate(''); 
  }
}

const showModalHandler = (schoolId) => {
  setSchoolIdDelete(schoolId);
  setShowModal(true);
};

const hideModalHandler = () => {
  setShowModal(false);
};

  return (
    <div>
        <Nav className="nav nav-tabs">
        <NavItem>
        <NavLink
            style={{ color: activeTab === 'add' ? '#a6d22c' : 'inherit', fontWeight: 'bold' }}
            className={`nav-link ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => { toggleTab('add'); }}
          >
            Pridėti
          </NavLink>
        </NavItem>
        <NavItem>
        <NavLink
          style={{ color: activeTab === 'update' ? '#f3943c' : 'inherit' , fontWeight: 'bold'}}
            className={`nav-link ${activeTab === 'update' ? 'active' : ''}`}
            onClick={() => { toggleTab('update'); }}
          >
            Atnaujinti
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            style={{ color: activeTab === 'delete' ? '#bf1a2f' : 'inherit' , fontWeight: 'bold'}}
            className={`nav-link ${activeTab === 'delete' ? 'active' : ''}`}
            onClick={() => { toggleTab('delete'); }}
          >
            Ištrinti
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="add">
      {/* ADD */}
    <Row>
      <Col>
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          <i class="bi bi-patch-plus-fill me-2"></i>
            Naujos mokyklos pridėjimas
          </CardTitle>
          <CardBody>
          {message && <div style={{ marginBottom: '10px', color: message.includes('Klaida') ? 'red' : 'green' }}>{message}</div>}
            <Form onSubmit={createSchool}>
              <FormGroup>
                <Label for="title">Pavadinimas</Label>
                <Input
                  id="title"
                  name="title"
                  type="textarea"
                  style={{ height: '30px' }}
                  required
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="license">Licenzijos galiojimo pabaiga</Label>
                <Input
                  id="license"
                  name="license"
                  type="date"
                  style={{ height: '30px' }}
                  required
                  value={licenseInput}
                  onChange={(e) => setLicenseInput(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
              <Label for="title">CSV failas</Label>
              <Input
                type="file"
                id="file"
                name="file"
                accept=".csv"
                required
                onChange={(e) => setFileInput(e.target.files[0])}
                /></FormGroup>
                <Button  style={{
                    backgroundColor: '#a6d22c',
                    border: 'none',
                    float: 'left', 
                    marginBottom: '10px',
                    color: 'white'
                  }}>Įrašyti
                </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>

    </TabPane>
        <TabPane tabId="update">


{/* UPDATE */}


    <Row>
      <Col>
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          <i class="bi bi-arrow-up-square-fill me-2"></i>
            Mokyklos informacijos atnaujinimas
          </CardTitle>
          <CardBody>
          {message && <div style={{ marginBottom: '10px', color: message.includes('Klaida') ? 'red' : 'green' }}>{message}</div>}
            <Form onSubmit={updateSchool}>
              <FormGroup>
                <Label for="title3">Mokykla</Label>
                <Input
                    type="select"
                    id="title3"
                    value={schoolIdUpdate}
                    onChange={(e) => handleSchoolChange(e.target.value)}
                    data-testid = {'updateSchool'}
                  >
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>{school.title}</option>
                    ))}
                  </Input>
              </FormGroup>
              <FormGroup>
                <Label for="title2">Pavadinimas (jei keičiasi)</Label>
                <Input
                  id="title2"
                  name="title2"
                  type="textarea"
                  style={{ height: '30px' }}
                  value={titleInputUpdate}
                  onChange={(e) => setTitleInputUpdate(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="license2">Licenzijos galiojimo pabaiga</Label>
                <Input
                  id="license2"
                  name="license2"
                  type="date"
                  style={{ height: '30px' }}
                  value={licenseInputUpdate}
                  onChange={(e) => setLicenseInputUpdate(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
              <Label for="file2">CSV failas</Label>
              <Input
                type="file"
                id="file2"
                name="file2"
                accept=".csv"
                onChange={(e) => setFileInputUpdate(e.target.files[0])}
                /></FormGroup>
                 <Button  style={{
                    backgroundColor: '#a6d22c',
                    border: 'none',
                    float: 'left', 
                    marginBottom: '10px',
                    color: 'white'
                  }}>Įrašyti
                </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>

    </TabPane>
        <TabPane tabId="delete">
    
{/* DELETE */}

<Row>
      <Col>
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          <i class="bi bi-patch-minus-fill me-2"></i>
            Mokyklų šalinimas
          </CardTitle>
          <CardBody>
          {message && <div style={{ marginBottom: '10px', color: message.includes('Klaida') ? 'red' : 'green' }}>{message}</div>}
           
          <div className="list">
            <Modal show={showModal} hide={hideModalHandler} onConfirm={deleteSchool}></Modal>
            <Table>
              <thead>
                <tr>
                  <th>Pavadinimas</th>
                  <th>Licenzija iki</th>
                  <th>Šalinti</th>
                </tr>
              </thead>
              <tbody>
              {schools.length === 0 ? (
                <tr>
                  <td colSpan="3">Mokyklų nėra</td>
                </tr>
              ) : (
                schools.map((school) => (
                  <tr key={school.id}>
                    <td>{school.title}</td>
                    <td>{school.license_end}</td>
                    <td>
                    <Button style={{  border: 'none', background: 'transparent' }} onClick={() => showModalHandler(school.id)}>             
                      ✖
                      </Button>
                    </td>
                  </tr>
              )))}
              
              </tbody>
            </Table>
              </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          </TabPane>
            </TabContent>
          </div>
  );
};

export default AdminSchool;
