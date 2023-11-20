import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  CardTitle,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import './HomeworkForm.css'; // Import your CSS for additional styling
import { useNavigate } from 'react-router-dom';

const AllHomework = () => {
  const [homeworkName, setHomeworkName] = useState('');
  const [pairs, setPairs] = useState([{ question: '', answer: '', image: null, points: 0 }]);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate  = useNavigate();
  const handleHomeworkNameChange = (e) => {
    setHomeworkName(e.target.value);
  };

  const handlePairChange = (index, field, value) => {
    const updatedPairs = [...pairs];
    updatedPairs[index][field] = value;
    setPairs(updatedPairs);
  };

  const handleImageChange = (index, event) => {
    const updatedPairs = [...pairs];
    updatedPairs[index].image = event.target.files[0];
    setPairs(updatedPairs);
  };
  const addPair = () => {
    setPairs([...pairs, { question: '', answer: '', image: null }]);
  };

  const removePair = (index) => {
    const updatedPairs = [...pairs];
    updatedPairs.splice(index, 1);
    setPairs(updatedPairs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pairs.length > 0 && pairs.some(pair => pair.question.trim() !== '' && pair.answer.trim() !== '')) {
      const formData = new FormData();
      formData.append('homeworkName', homeworkName);

      pairs.forEach((pair, index) => {
        formData.append(`pairs[${index}][question]`, pair.question);
        formData.append(`pairs[${index}][answer]`, pair.answer);
        if (pair.image) {
          formData.append(`pairs[${index}][image]`, pair.image);
        }
      });

      // Send formData to your backend (Django) using fetch or axios
      console.log('Data to be sent:', formData);
      // Perform further actions like API request
      try {
        const response = await fetch('http://localhost:8000/submit_homework/', {
            //TODO:TOKEN
          method: 'POST',
          body: formData,
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log('Response from Django:', data);
          if (data.success) {
            setSuccessMessage(data.message); // Set the success message in state
          }
          // Handle other actions on successful submission
        } else {
          // Handle errors
          console.error('Failed to submit homework');
        
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert('Namų darbe privalo būti bent viena užduotis');
    }
  };
  const send = (event) => {
    navigate('/all-homework');
  }
  return (
    <Row>
      <Col>
      <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-pen me-2"></i>
            Namų darbo kūrimo forma
          </CardTitle>
          <CardBody>
          {successMessage &&<div style={{ marginBottom: '10px', color: successMessage.includes('Klaida') ? 'red' : 'green' }}>{successMessage}</div>}
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="homeworkName">Namų darbo pavadinimas</Label>
                <Input
                  type="text"
                  id="homeworkName"
                  value={homeworkName}
                  onChange={handleHomeworkNameChange}
                />
              </FormGroup>
              {pairs.map((pair, index) => (
                <div key={index} className="pair">
                  <FormGroup>
                    <Label for={`question${index}`}>Klausimas nr. {index+1}</Label>
                    <Input
                      type="text"
                      id={`question${index}`}
                      value={pair.question}
                      onChange={(e) => handlePairChange(index, 'question', e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for={`answer${index}`}>Atsakymas nr. {index+1}</Label>
                    <Input
                      type="text"
                      id={`answer${index}`}
                      value={pair.answer}
                      onChange={(e) => handlePairChange(index, 'answer', e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for={`image${index}`}>Paveikslėlis (nebūtina)</Label>
                    <Input
                      type="file"
                      id={`image${index}`}
                      accept="image/*"
                      onChange={(e) => handleImageChange(index, e)}
                    />
                    <FormGroup>
                    <Label for={`points${index}`}>Taškai nr. {index+1}</Label>
                    <Input
                      type="number"
                      id={`points${index}`}
                      value={pair.points}
                      onChange={(e) => handlePairChange(index, 'points', e.target.value)}
                      min="0"
                    />
                  </FormGroup>
                  </FormGroup>
                  <Button type="button" onClick={() => removePair(index)}>
                    Ištrinti
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addPair} className="add-pair-button">
                Pridėti klausimą
              </Button>
              <FormGroup>
                <Button type="submit" className="submit-button">
                  Įrašyti
                </Button>
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default AllHomework;
