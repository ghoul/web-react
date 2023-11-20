import React from "react";
import { Redirect } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
// import { useAlert } from "react-alert";
import { useLocation } from "react-router-dom";
import { useParams } from 'react-router-dom';
// import Forms from "./ui/Forms";
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
  Input
} from "reactstrap";
import { useNavigate } from 'react-router-dom';

export default function UpdateClass() {
  const { classsId } = useParams();
  const navigate  = useNavigate();
  const [message, setMessage] = useState(''); 
  console.log("id: ", classsId);

  const [titleInput, settitleInput] = useState("");
  const [fail, setFail] = useState("");
  let token = localStorage.getItem('token'); 

  const getClass = (classsId) => {
    fetch(
      `http://localhost:8000/handle_classes/${classsId}/`,
      {
        method: "GET",
        headers: {
          'Authorization' : `${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        settitleInput(data.title);
        console.log("grazino" + data);
      });
  };
  useEffect(() => {
    const id = classsId;
    getClass(id);
  }, []);

  useEffect(() => {
    // Do something when titleInput changes, e.g., log the value
    console.log("titleInput changed:", titleInput);
  }, [titleInput]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("classs id : " + classsId);
    const classs = {
      pk: classsId,
      title: titleInput,
    };
    console.log("viduj handle data" + classs.title);
    fetch(`http://localhost:8000/handle_classes/${classsId}/`, {
      method: "PUT", 
      headers: {
        'Authorization' : `${token}`,
        "Content-Type": "application/json",
        // "mode": "no-cors"
      },
      body: JSON.stringify(classs),
      
    })
    .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setMessage(data.success ? 'Operacija sėkminga!' : 'Klaida! '+ data.error);
        setTimeout(() => {
          setMessage('');
        }, 3000);
        //window.location.href = `http://localhost:3000/categories`;
      })
      .catch((error) => {
        console.error("Error:", error);
        setFail("Toks classs jau egzistuoja!");
        setMessage('Klaida!' + error.error);
      });
  };
  
  const send = (event) => {
    navigate('/all-classes');
  }
  return (
    <div>
    <Row>
          <Col>
          <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
            <Card>
              <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                <i class="bi bi-arrow-through-heart-fill me-2"></i>
                Klasės redagavimas
              </CardTitle>
              <CardBody>
              {message && <div style={{ marginBottom: '10px', color: message.includes('Klaida') ? 'red' : 'green' }}>{message}</div>}
                <Form onSubmit={handleSubmit}>  
                  <FormGroup>
                    <Label for="title">Pavadinimas</Label>
                    <Input id="title" name="title" type="textarea" style={{ height: '30px' }} 
                    required defaultValue={titleInput} onChange={(e) => settitleInput(e.target.value)}/>
                  </FormGroup>
                  <Button style={{ backgroundColor: '#204963', color: 'white'}}>Įrašyti</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
  );
}
