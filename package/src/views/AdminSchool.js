import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  CardTitle,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Table,
  Input,
  TabContent, TabPane, Nav, NavItem, NavLink
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Modal } from './Modal.js';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../layouts/config';
import './Style.css';
import Cookies from 'js-cookie';
const AddSchool = () => {
  const [titleInput, setTitleInput] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [licenseInput, setLicenseInput] = useState('');

  const [licenseInputUpdate, setLicenseInputUpdate] = useState('');
  const [titleInputUpdate, setTitleInputUpdate] = useState('');
  const [fileInputUpdate, setFileInputUpdate] = useState(null);

  const [fail, setFail] = useState('');
  const [message, setMessage] = useState(''); 
  const navigate  = useNavigate();
  let token = Cookies.get('token'); 
  const [showModal, setShowModal] = useState(false);
  const [schools, setSchools]  = useState([]);

  const [schoolIdDelete, setSchoolIdDelete]  = useState(1);
  const [schoolIdUpdate, setSchoolIdUpdate]  = useState(1);

  const [activeTab, setActiveTab] = useState('add');

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/handle_school/`, {
          method: 'GET',
          headers: {
            'Authorization' : `${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setSchools(data.schools);
        setSchoolIdUpdate(data.schools[0].id)
        console.log("schoolid0: " + data.schools[0].id);
        //TODO: SYNC nes cia nespeja pakeist kai jau reikia rofyt kodel? 
        setLicenseInputUpdate(data.schools[0].license)
        console.log("license: " + data.schools[0].license);
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };

    fetchSchools();
  }, []);

  const createSchool = async (event) => {
    event.preventDefault();
 // const csrfToken = getCookie('csrftoken');
    // function getCookie(name) {
    //   const value = `; ${document.cookie}`;
    //   const parts = value.split(`; ${name}=`);
    //   if (parts.length === 2) return parts.pop().split(';').shift();
    // }
    const formData = new FormData();
    formData.append('title', titleInput);
    formData.append('file', fileInput);
    formData.append('license', licenseInput);

    console.log('Request Body: ', formData);
    console.log(titleInput);
    console.log(licenseInput);

    try {
        const response = await fetch(`${BACKEND_URL}/handle_school/`, {
            method: 'POST',
            headers: {
                'Authorization' : `${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        const formattedTitle = response.headers.get('FormattedTitle'); // Access formatted title from response
        a.download = `${formattedTitle}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // const data = await response.json();
        // console.log('Response Body: ', data);
        // if(blob){
          setMessage(blob ? 'Operacija sėkminga!' : 'Klaida! ');
          // setMessage(data.success ? 'Operacija sėkminga!' : 'Klaida! ' + data.error);
          setTimeout(() => {
              setMessage('');
          }, 3000);
        // }
       
        
    } catch (error) {
        console.error(error);
        setMessage('Klaida!' + error.error);
    }
};
const updateSchool = async (event) => {
  event.preventDefault();
  const formData2 = new FormData();
  formData2.append('title', titleInputUpdate);
  formData2.append('file', fileInputUpdate);
  formData2.append('license', licenseInputUpdate);


  console.log('Request Body: ', formData2);
  console.log(titleInputUpdate);
  console.log(licenseInputUpdate);

  try {
      const response = await fetch(`${BACKEND_URL}/handle_school_id/${schoolIdUpdate}/`, {
          method: 'POST',
          headers: {
              'Authorization' : `${token}`,
          },
          body: formData2,
      });

      if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      // const formattedTitle = response.headers.get('FormattedTitle'); // Access formatted title from response
      // a.download = `${formattedTitle}`;
      a.download = "login_credentials.txt"
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // const data = await response.json();
      // console.log('Response Body: ', data);
      // if(blob){
        setMessage(blob ? 'Operacija sėkminga!' : 'Klaida! ');
        // setMessage(data.success ? 'Operacija sėkminga!' : 'Klaida! ' + data.error);
        setTimeout(() => {
            setMessage('');
        }, 3000);
      // }
     
      
  } catch (error) {
      console.error(error);
      setMessage('Klaida!' + error.error);
  }
};

const deleteSchool = async (event) => {
  event.preventDefault();

  try {
      fetch(`${BACKEND_URL}/handle_school_id/${schoolIdDelete}/`, {
          method: 'DELETE',
          headers: {
              'Authorization' : `${token}`,
              'Content-Type': 'application/json',
          }
      }).then(response => response.json())
      .then(data => {
        // Handle success, update homework state, and close the modal
        const updatedSchools = schools.filter(school => school.id !== schoolIdDelete);
        setSchools(updatedSchools);
        hideModalHandler(); // Move hideModalHandler inside the .then() block
        // window.location.reload();
      })
      .catch(error => {
        // Handle error
        // window.location.reload();
        console.error('Error deleting school:', error);
      });
     
      
  } catch (error) {
      console.error(error);
      setMessage('Klaida!' + error.error);
  }
};
const handleSchoolChange = (selectedSchoolId) => {
  setSchoolIdUpdate(selectedSchoolId);
  const selectedSchool = schools.find(school => school.id === selectedSchoolId);
  if (selectedSchool) {
    setLicenseInputUpdate(selectedSchool.license);
  } else {
    setLicenseInputUpdate(''); // Reset license input if no school is selected
  }
  console.log("license setted: " + licenseInputUpdate);
  console.log("name setted: " + titleInputUpdate);
}

const showModalHandler = (schoolId) => {
  setSchoolIdDelete(schoolId);
  console.log("selectedid: " + schoolId);
  setShowModal(true);
  console.log("modal show true");
};

const hideModalHandler = () => {
  setShowModal(false);
  console.log("modal show false");
};


  const send = (event) => {
    navigate('/');
  }
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
               {/* {% csrf_token %} */}
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
        <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
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
               {/* {% csrf_token %} */}
               {/* TODO: jeigu keiciasi pavadinimas mokyklos? - pasirenka is saraso kuri mokykla ir viduj pirma eilute pavadinimas*/}
              <FormGroup>
                <Label for="title3">Mokykla</Label>
                <Input
                    type="select"
                    id="title3"
                    value={schoolIdUpdate}
                    onChange={(e) => handleSchoolChange(e.target.value)}
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
        <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
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
           
               {/* {% csrf_token %} */}
               {/* TODO: jeigu keiciasi pavadinimas mokyklos? */}


               <div className="list">
      <Modal show={showModal} hide={hideModalHandler} onRemoveProduct={deleteSchool}></Modal>
      <Table>
        <thead>
          <tr>
            <th>Pavadinimas</th>
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
            
              <td>
             <Button style={{  border: 'none', background: 'transparent' }} onClick={() => showModalHandler(school.id)}>             
                ✖
                </Button>
               </td>
            </tr>
        ))
        )}
        
        </tbody>
      </Table>
        </div>
          </CardBody>
        </Card>
        <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
      </Col>
    </Row>
    </TabPane>
      </TabContent>
    </div>
  );
};

export default AddSchool;
