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
const AddClass = () => {
  const [titleInput, setTitleInput] = useState('');
  const [fail, setFail] = useState('');
  const [message, setMessage] = useState(''); 
  const navigate  = useNavigate();
  let token = localStorage.getItem('token'); 
  const createClass = (event) => {
    event.preventDefault();

    const csrfToken = getCookie('csrftoken');
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
    const classs = {
      title: titleInput,
    };

    console.log('Request Body: ', JSON.stringify(classs));

    fetch(`${BACKEND_URL}/handle_classes/`, {
      method: 'POST',
      headers: {
        'Authorization' : `${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(classs),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Response Body: ', data);
        setMessage(data.success ? 'Operacija sėkminga!' : 'Klaida! '+ data.error);
        setTimeout(() => {
          setMessage('');
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
        setMessage('Klaida!' + error.error);
      });
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
            <i className="bi bi-arrow-through-heart-fill me-2"></i>
            Naujos klasės pridėjimas
          </CardTitle>
          <CardBody>
          {message && <div style={{ marginBottom: '10px', color: message.includes('Klaida') ? 'red' : 'green' }}>{message}</div>}
            <Form onSubmit={createClass}>
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
              <Button style={{ backgroundColor: '#204963', color: 'white'}}>Įrašyti</Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default AddClass;
