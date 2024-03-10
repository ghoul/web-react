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
import './HomeworkForm.css';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../layouts/config';
import './Style.css';
// import CSRFToken from './CsrfToken';
import Cookies from 'js-cookie';


const AllHomework = () => {
  const [homeworkName, setHomeworkName] = useState('');
  const [pairs, setPairs] = useState([{ type: 'select', question: '', options: [], answer: '', image: null, points: 0 }]);
  const [successMessage, setSuccessMessage] = useState('');
  const [correctOptionIndexes, setCorrectOptionIndexes] = useState(Array(pairs.length).fill(null));
  //TODO: gali but daugiau nei pairs ilgis
  const [multipleOptionIndexes, setMultipleOptionIndexes] = useState([]) //{qid: '', oid: ''} dic with question id and option id corrects multiple
  const navigate = useNavigate();
  let token = Cookies.get('token');
  var csrftoken = Cookies.get('csrftoken');

  const handleHomeworkNameChange = (e) => {
    console.log(e.target.value);
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

  const handleOptionChange = (index, optionIndex, value) => {
    const updatedPairs = [...pairs];
    updatedPairs[index].options[optionIndex] = value;
    setPairs(updatedPairs);
  };

  const addPair = () => {
    setPairs([...pairs, { type: 'select', question: '', options: [], answer: '', image: null, points: 0 }]);
  };

  const removePair = (index) => {
    const updatedPairs = [...pairs];
    updatedPairs.splice(index, 1);
    setPairs(updatedPairs);
  };

  const addOption = (index) => {
    const updatedPairs = [...pairs];
    updatedPairs[index].options.push('');
    setPairs(updatedPairs);
  };

  const removeOption = (index, optionIndex) => {
    correctOptionIndexes[index] = null;
    const updatedPairs = [...pairs];
    updatedPairs[index].options.splice(optionIndex, 1);
    setPairs(updatedPairs);

    const updatedMultipleOptionIndexes = multipleOptionIndexes.filter(entry => !(entry.qid === index && entry.oid === optionIndex));
    setMultipleOptionIndexes(updatedMultipleOptionIndexes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pairs.length > 0 && pairs.some(pair => pair.question.trim() !== '' )) { //&& pair.answer.trim() !== ''
      const formData = new FormData();
      formData.append('homeworkName', homeworkName);

      pairs.forEach((pair, index) => {
        formData.append(`pairs[${index}][question]`, pair.question);
        formData.append(`pairs[${index}][qtype]`, pair.type);
        console.log("type: " + pair.type);
        formData.append(`pairs[${index}][answer]`, pair.answer);
        formData.append(`pairs[${index}][points]`, pair.points);
        if (pair.image) {
          formData.append(`pairs[${index}][image]`, pair.image);
        }
        if (pair.type === 'select') {
          formData.append(`pairs[${index}][correctOptionIndex]`, correctOptionIndexes[index]);
  
          pair.options.forEach((option, optionIndex) => {
              formData.append(`pairs[${index}][options][${optionIndex}]`, option);
              console.log("select: " + option);
          });
      
        }
        if (pair.type === 'multiple') {
          multipleOptionIndexes.forEach((pairIds, indexId) => {
            if(pairIds.qid === index) //jei einamojo klausimo ats randa
            {
              formData.append(`pairs[${index}][multipleOptionIndex][${pairIds.oid}]`, multipleOptionIndexes[indexId].oid);
            }
            
          })

          pair.options.forEach((option, optionIndex) => {
              formData.append(`pairs[${index}][options][${optionIndex}]`, option);
              console.log("multiple: " + option);
          });
      
        }

      });

      // Send formData to your backend (Django) using fetch or axios
      console.log('Data to be sent:', formData);
      // Perform further actions like API request
      try {
        console.log(formData.homeworkName);
        const response = await fetch(`${BACKEND_URL}/handle_homework/`, {
          method: 'POST',
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
          },
          body: formData, // Send formData directly
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

  const handleCorrectOptionChange = (index, value) => {
    const updatedCorrectOptionIndexes = [...correctOptionIndexes];
    updatedCorrectOptionIndexes[index] = value;
    setCorrectOptionIndexes(updatedCorrectOptionIndexes);
  };

  const handleMultipleCorrectOptionChange = (index, value) => { //qid ir oid
    const updatedMultipleOptionIndexes = [...multipleOptionIndexes];
    const existingEntryIndex = checkCorrect(index,value)
    if (existingEntryIndex) {
      // If the entry exists, remove it (uncheck)
      updatedMultipleOptionIndexes.splice(existingEntryIndex, 1);
    } else {
      // If the entry doesn't exist, add it (check)
      updatedMultipleOptionIndexes.push({ qid: index, oid: value });
    }

    // updatedMultipleOptionIndexes.push({'qid' : index, 'oid' : value});
    setMultipleOptionIndexes(updatedMultipleOptionIndexes);
    console.log(multipleOptionIndexes);
    console.log(pairs);
  };

  const checkCorrect = (qid, oid) =>{
    const existingEntryIndex = multipleOptionIndexes.findIndex(entry => entry.qid === qid && entry.oid === oid);
    return existingEntryIndex !== -1;
  }


  const send = (event) => {
    navigate('/all-homework');
  };

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
            {successMessage && <div style={{ marginBottom: '10px', color: successMessage.includes('Klaida') ? 'red' : 'green' }}>{successMessage}</div>}
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <h6 style={{ textDecoration: 'underline' }}>
                <Label for="homeworkName">Namų darbo pavadinimas</Label>
                </h6>
                <Input
                  type="text"
                  id="homeworkName"
                  value={homeworkName}
                  onChange={handleHomeworkNameChange}
                />
              </FormGroup>
              {pairs.map((pair, index) => (
                <Card key={index} className="pair-card">
                  <CardBody>
                    <Row>
                      <Col>
                    <FormGroup>
                      <Label for={`type${index}`} style={{}}>Užduotis nr. {index + 1}</Label>
                      <Input
                        type="select"
                        id={`type${index}`}
                        value={pair.type}
                        onChange={(e) => handlePairChange(index, 'type', e.target.value)}
                      >
                        <option value="select">Vieno pasirinkimo atsakymas</option>
                        <option value="multiple">Kelių pasirinkimų atsakymas</option>
                        <option value="write">Rašytinis atsakymas</option>
                      </Input>
                    </FormGroup>
                    </Col>
                    <Col>
                    <FormGroup>
                          <Label for={`points${index}`}>Taškai</Label>
                          <Input
                            type="number"
                            id={`points${index}`}
                            value={pair.points}
                            onChange={(e) => handlePairChange(index, 'points', e.target.value)}
                            min="0"
                          />
                        </FormGroup>
                        </Col>
                    </Row>
{pair.type === 'multiple' && (
  <div>
    <FormGroup>
      <Label for={`question${index}`}>Klausimas</Label>
      <Input
        type="text"
        id={`question${index}`}
        value={pair.question}
        onChange={(e) => handlePairChange(index, 'question', e.target.value)}
      />
    </FormGroup>
    <FormGroup>
      <Row>
      <Label>Atsakymas</Label>
      </Row>
      {pair.options.map((option, optionIndex) => (
        <div key={optionIndex} className="option">
          <Row  className="align-items-center">
            <Col>
              <Input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
              />
            </Col>
            <Col>
            <Label check>
              <Input
                type="checkbox"
                name={`multipleOption${index}`}
                style={{ display: 'none' }} 
                checked={checkCorrect(index, optionIndex)}
                onChange={() => handleMultipleCorrectOptionChange(index, optionIndex)}
              />
              {' '}
              <i
                className={`bi ${checkCorrect(index, optionIndex) ? 'bi-check-square-fill' : 'bi-check-square'}`}
              ></i>
            </Label>
            </Col>
            <Col style={{ textAlign: 'left', paddingLeft: '0' }}>
              <Button type="button" style={{  border: 'none', background: 'transparent' }} onClick={() => removeOption(index, optionIndex)}>
              ✖
              </Button>
            </Col>
          </Row>
        </div>
      ))}
      <Button type="button" style={{  border: 'none', background: 'transparent' , color: 'black'}} 
       onClick={() => addOption(index)}
       disabled={pairs[index].options.length >= 5}>
      <i class="bi bi-plus-lg"></i> pasirinkimas
      </Button>
    </FormGroup>
  </div>
)}

  {pair.type === 'select' && (
  <div>
    <FormGroup>
      <Label for={`question${index}`}>Klausimas</Label>
      <Input
        type="text"
        id={`question${index}`}
        value={pair.question}
        onChange={(e) => handlePairChange(index, 'question', e.target.value)}
      />
    </FormGroup>
    <FormGroup>
      <Row>
      <Label>Atsakymas</Label>
      </Row>
      {pair.options.map((option, optionIndex) => (
        <div key={optionIndex} className="option">
          <Row  className="align-items-center">
            <Col>
              <Input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
              />
            </Col>
            <Col>
              <Label check>
                <Input
                  type="radio"
                  name={`correctOption${index}`}
                  style={{ display: 'none' }} 
                  checked={correctOptionIndexes[index] === optionIndex}
                  onChange={() => handleCorrectOptionChange(index, optionIndex)}
                />{' '}
                <i
                className={`bi ${correctOptionIndexes[index] === optionIndex ? 'bi-check-circle-fill' : 'bi-check-circle'}`}
              ></i>
              </Label>
            </Col>
            <Col style={{ textAlign: 'left', paddingLeft: '0' }}>
              <Button type="button" style={{  border: 'none', background: 'transparent' }} onClick={() => removeOption(index, optionIndex)}>
              ✖
              </Button>
            </Col>
          </Row>
        </div>
      ))}
      <Button type="button" style={{  border: 'none', background: 'transparent' , color: 'black'}}
        onClick={() => addOption(index)}
        disabled={pairs[index].options.length >= 5}>
      <i class="bi bi-plus-lg"></i> pasirinkimas
      </Button>
    </FormGroup>
  </div>
)}

                    {pair.type === 'write' && (
                      <div>
                        <FormGroup>
                          <Label for={`question${index}`}>Klausimas</Label>
                          <Input
                            type="text"
                            id={`question${index}`}
                            value={pair.question}
                            onChange={(e) => handlePairChange(index, 'question', e.target.value)}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for={`answer${index}`}>Atsakymas</Label>
                          <Input
                            type="text"
                            id={`answer${index}`}
                            value={pair.answer}
                            onChange={(e) => handlePairChange(index, 'answer', e.target.value)}
                          />
                        </FormGroup>
                      
                      </div>
                    )}
                    <Button type="button" style={{backgroundColor: '#bf1a2f', color: 'white', border: 'none'}} onClick={() => removePair(index)}>
                    <i class="bi bi-dash-lg"></i> Ištrinti
                    </Button>
                  </CardBody>
                </Card>
              ))}
            <Button
                type="button"
                style={{ backgroundColor: '#a6d22c', color: 'white', border: 'none' }}
                onClick={addPair}
                className="add-pair-button"
                disabled={pairs.length >= 15}
              >
              <i class="bi bi-plus-lg"></i> Pridėti klausimą
              </Button>
              <FormGroup>
                <Button type="submit"  style={{backgroundColor: 'black', color: 'white', border: 'none'}} className="submit-button">
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
