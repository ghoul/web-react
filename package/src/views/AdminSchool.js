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
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Modal } from './Modal.js';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../layouts/config';
import './Style.css';
const AddSchool = () => {
  const [titleInput, setTitleInput] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [licenseInput, setLicenseInput] = useState('');
  const [fail, setFail] = useState('');
  const [message, setMessage] = useState(''); 
  const navigate  = useNavigate();
  let token = localStorage.getItem('token'); 
  const [showModal, setShowModal] = useState(false);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState(null);
  const [homework, setHomework] = useState([]);
  const [schools, setSchools]  = useState([]);

  const [schoolIdDelete, setSchoolIdDelete]  = useState('');
  const [schoolIdUpdate, setSchoolIdUpdate]  = useState('');

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
        a.download = 'login_credentials.txt';
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
      const response = await fetch(`${BACKEND_URL}/handle_school_id/${schoolIdUpdate}/`, {
          method: 'PUT',
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
      a.download = 'login_credentials.txt';
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
    navigate('/all-classes');
  }
  return (
    <div>

      {/* ADD */}
    <Row>
      <Col>
      <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
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
      </Col>
    </Row>




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
            <Form onSubmit={deleteSchool}>
               {/* {% csrf_token %} */}
               {/* TODO: jeigu keiciasi pavadinimas mokyklos? */}


               <div className="list">
      <Modal show={showModal} hide={hideModalHandler} onRemoveProduct={deleteSchool}></Modal>
      {/* <Modal2 showModal={showModal} handleClose={hideModalHandler} /> */}
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

    </div>
  );
};

export default AddSchool;
