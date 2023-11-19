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

const Add = () => {
  const [titleInput, setTitleInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [fail, setFail] = useState('');
  const [message, setMessage] = useState(''); 
  const navigate  = useNavigate();
  let token = localStorage.getItem('token'); 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/categories/', {
          headers: {
            'Authorization' : `${token}`,
            "Content-Type": "application/json"
          },
        }); // Replace with your API endpoint to fetch categories
        const data = await response.json();
        setCategories(data); // Assuming data is an array of category objects with 'id' and 'name' properties
        if (data.length > 0) {
          setCategoryInput(data[0].id); // Set the default category to the first category fetched from the database
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []); // Run the effect only once after the initial render

  const createTrick = (event) => {
    event.preventDefault();

    const trick = {
      title: titleInput,
      description: descriptionInput,
      link: linkInput,
      category: categoryInput,
    };

    console.log('Request Body: ', JSON.stringify(trick));

    fetch(`http://localhost:8000/categories/${trick.category}/tricks/`, {
      method: 'POST',
      headers: {
        'Authorization' : `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trick),
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
    navigate('/');
  }
  return (
    <Row>
      <Col>
      <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Į pradžią</Button>
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-arrow-through-heart-fill me-2"></i>
            Naujo triuko įkėlimas
          </CardTitle>
          <CardBody>
          {message && <div style={{ marginBottom: '10px', color: message.includes('Klaida') ? 'red' : 'green' }}>{message}</div>}
          
            <Form onSubmit={createTrick}>
              <FormGroup>
                <Label for="link">Nuoroda</Label>
                <Input
                  id="link"
                  name="link"
                  type="textarea"
                  style={{ height: '30px' }}
                  required
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                />
              </FormGroup>
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
                <Label for="description">Aprašymas</Label>
                <Input
                  id="description"
                  name="description"
                  type="textarea"
                  style={{ height: '60px' }}
                  required
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="category">Kategorija</Label>
                <Input
                  id="category"
                  name="category"
                  type="select"
                  required
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
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
};

export default Add;
