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
  Input,
} from 'reactstrap';
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
        const response = await fetch(`${BACKEND_URL}/add_school/`, {
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

  const send = (event) => {
    navigate('/all-classes');
  }
  return (
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
              <Button className='more-button'>Įrašyti</Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default AddSchool;
