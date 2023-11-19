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

export default function UpdateComment() {
  const { commentId,categoryName, trickId } = useParams();

  console.log("id: ", commentId);

  const [descriptionInput, setdescriptionInput] = useState("");
  const [fail, setFail] = useState("");
  const [message, setMessage] = useState(''); 
  const navigate  = useNavigate();
  let token = localStorage.getItem('token'); 
  const getComment = (commentId) => {
    fetch(
      `http://localhost:8000/categories/1/tricks/${trickId}/comments/${commentId}/`,
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
        setdescriptionInput(data.text);
        console.log(data);
      });
  };
  useEffect(() => {
    const id = commentId;
    getComment(id);
  },[]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("commentId id : " + commentId);
    const comment = {
      pk: commentId,
      text: descriptionInput,
    };
    console.log("viduj handle data" + comment.text);
    fetch(`http://localhost:8000/categories/1/tricks/${trickId}/comments/${commentId}/`, { 
      method: "PUT", 
      headers: {
        'Authorization' : `${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(comment),
      
    })
    .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setMessage(data.success ? 'Operacija sėkminga!' : 'Klaida! '+ data.error);
        setTimeout(() => {
          setMessage('');
        }, 3000);
        // window.location.href = `http://localhost:3000/category/${categoryName}/trick/${trickId}`;
      })
      .catch((error) => {
        console.error("Error:", error);
        setFail("Toks triukas jau egzistuoja!");
        setMessage('Klaida!' + error.error);
      });
  };
  
  const send = (event) => {
    navigate(`/category/${categoryName}/trick/${trickId}`);
  }
  return (
    <Row>
          <Col>
          <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
            <Card>
              <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                <i class="bi bi-arrow-through-heart-fill me-2"></i>
                Komentaro redagavimas
              </CardTitle>
              <CardBody>
              {message && <div style={{ marginBottom: '10px', color: message.includes('Klaida') ? 'red' : 'green' }}>{message}</div>}
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="description">Tekstas</Label>
                    <Input id="description" name="description" type="textarea" style={{ height: '60px' }} 
                     required defaultValue={descriptionInput} onChange={(e) => setdescriptionInput(e.target.value)}/>
                  </FormGroup>
                  <Button style={{ backgroundColor: '#204963', color: 'white'}}>Įrašyti</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
  );
}
