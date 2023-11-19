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

export default function UpdateTrick() {
  const { categoryName, trickId } = useParams();
  const navigate  = useNavigate();
  console.log("id: ", trickId);

  const [trick, setTrick] = useState([]);
  const [titleInput, settitleInput] = useState("");
  const [descriptionInput, setdescriptionInput] = useState("");
  const [linkInput, setlinkInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryInput, setcategoryInput] = useState("");
  const [message, setMessage] = useState(''); 
  const [fail, setFail] = useState("");
  let token = localStorage.getItem('token'); 

  const getTrick = (trickId) => {
    fetch(
      `http://localhost:8000/categories/1/tricks/${trickId}/`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          'Authorization' : `${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setTrick(data.pk);
        settitleInput(data.title);
        setdescriptionInput(data.description);
        setlinkInput(data.link);
        setcategoryInput(data.category);
        console.log(data);
      });
  };
  useEffect(() => {
    const id = trickId;
    getTrick(id);
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/categories/', {
          method: 'GET',  // Specify the GET method
          headers: {
            // You can include headers like authorization tokens if needed
            'Authorization' : `${token}`,
            'Content-Type': 'application/json',  // Specify the content type if required
          },
        });
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("trick id : " + trickId);
    const trick = {
      pk: trickId,
      title: titleInput,
      description: descriptionInput,
      link:linkInput,
      category: categoryInput
    };
    console.log("viduj handle data" + trick.link);
    fetch(`http://localhost:8000/categories/1/tricks/${trickId}/`, { //tricks/edit/${trickId}/
      method: "PUT", 
      headers: {
        'Authorization' : `${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(trick),
      
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
    // onSubmit={Click}
    <Row>
          <Col>
          <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
            <Card>
              <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                <i class="bi bi-arrow-through-heart-fill me-2"></i>
                Triuko redagavimas
              </CardTitle>
              <CardBody>
              {message && <div style={{ marginBottom: '10px', color: message.includes('Klaida') ? 'red' : 'green' }}>{message}</div>}
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="link">Nuoroda</Label>
                    <Input id="link" name="link" type="textarea" style={{ height: '30px' }} 
                     required value={linkInput} onChange={(e) => setlinkInput(e.target.value) }/> 
                  </FormGroup>
                  <FormGroup>
                    <Label for="title">Pavadinimas</Label>
                    <Input id="title" name="title" type="textarea" style={{ height: '30px' }} 
                    required defaultValue={titleInput} onChange={(e) => settitleInput(e.target.value)}/>
                  </FormGroup>
                  <FormGroup>
                    <Label for="description">Aprašymas</Label>
                    <Input id="description" name="description" type="textarea" style={{ height: '60px' }} 
                     required defaultValue={descriptionInput} onChange={(e) => setdescriptionInput(e.target.value)}/>
                  </FormGroup>
                  <FormGroup>
                <Label for="category">Kategorija</Label>
                <Input
                  id="category"
                  name="category"
                  type="select"
                  required
                  value={categoryInput}
                  onChange={(e) => setcategoryInput(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.type}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <Button style={{ backgroundColor: '#204963', color: 'white'}}>Įrašyti</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
  );
}
