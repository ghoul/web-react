import React, { useState } from 'react';
import {Row, Col, Card, CardTitle, CardBody, Button, Form, FormGroup, Label, Input} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../layouts/config';
import './Style.css';
import Cookies from 'js-cookie';
import axios from 'axios';


const AddHomework = () => {
  const [homeworkName, setHomeworkName] = useState('');
  const [pairs, setPairs] = useState([{ type: 'select', question: '', options: [], answer: '', image: null, points: 0 }]);
  const [successMessage, setMessage] = useState(''); 
  const [correctOptionIndexes, setCorrectOptionIndexes] = useState(Array(pairs.length).fill(null));

  const [multipleOptionIndexes, setMultipleOptionIndexes] = useState([]) 
  const navigate = useNavigate();
  let token = Cookies.get('token');

  const handleHomeworkNameChange = (e) => {
    setHomeworkName(e.target.value);
  };

  const handlePairChange = (index, field, value) => {
    const updatedPairs = [...pairs];
    updatedPairs[index][field] = value;
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
  const handleCorrectOptionChange = (index, value) => {
    const updatedCorrectOptionIndexes = [...correctOptionIndexes];
    updatedCorrectOptionIndexes[index] = value;
    setCorrectOptionIndexes(updatedCorrectOptionIndexes);
  };

  const handleMultipleCorrectOptionChange = (index, value) => { //question id and option id
    const updatedMultipleOptionIndexes = [...multipleOptionIndexes];
    const existingEntryIndex = checkCorrect(index,value)
    if (existingEntryIndex>-1) {
      updatedMultipleOptionIndexes.splice(existingEntryIndex, 1);
    } else {
      updatedMultipleOptionIndexes.push({ qid: index, oid: value });
    }
    setMultipleOptionIndexes(updatedMultipleOptionIndexes);
  };

  const checkCorrect = (qid, oid) =>{
    const existingEntryIndex = multipleOptionIndexes.findIndex(entry => entry.qid === qid && entry.oid === oid);
    return existingEntryIndex;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasEmptyPoints = pairs.some(pair => pair.points === 0);
    if(hasEmptyPoints){
      setMessage('Klaida! Nenustatyti taškai');
      return;
    }
    if (pairs.length > 0 && pairs.some(pair => pair.question.trim() !== '' )) {
      const formData = new FormData();
      formData.append('title', homeworkName);
      pairs.forEach((pair, index) => {
        console.log(correctOptionIndexes);
        formData.append(`pairs[${index}][qtype]`, pair.type);
        formData.append(`pairs[${index}][question]`, pair.question);
        formData.append(`pairs[${index}][points]`, pair.points);
        formData.append(`pairs[${index}][answer]`, pair.answer);
        if (pair.type === 'select' || pair.type === 'multiple') {
          pair.options.forEach((option, optionIndex) => {
            formData.append(`pairs[${index}][options][${optionIndex}]`, option);
          });
        }
        if (pair.type === 'select') {
          formData.append(`pairs[${index}][correctOptionIndex]`, correctOptionIndexes[index]);
          
        }
        if (pair.type === 'multiple') {
          multipleOptionIndexes.forEach(({ qid, oid }) => {
            if (qid === index) {
              formData.append(`pairs[${index}][multipleOptionIndex][${oid}]`, oid);
            }
          });
        }
      });
  
      try {
        const response = await axios.post(`${BACKEND_URL}/homework/`, formData, {
            headers: {
                'Authorization': `Token ${token}`,
                'X-CSRFToken': Cookies.get('csrftoken')
            },
        });
        console.log(response);
        console.log(response.data);
        if (response.status === 201) {
          setMessage("Operacija sėkminga!");
        }
      } catch (error) {
        
        console.error('Klaida:', error);
        if (error.response && error.response.data && error.response.data.error) {
          setMessage('Klaida! ' + error.response.data.error);
        } else {
            setMessage('Klaida!');
        }
      }
    } else {
      setMessage('Klaida! Namų darbe privalo būti bent viena užduotis');
    }
  };

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
                            required
                            type="number"
                            id={`points${index}`}
                            value={pair.points}
                            onChange={(e) => handlePairChange(index, 'points', e.target.value)}
                            min="0"
                            data-testid={`points${index}`}
                          />
                        </FormGroup>
                        </Col>
                    </Row>
                      {pair.type === 'multiple' && (
                        <div>
                          <FormGroup>
                            <Label for={`question${index}`}>Klausimas</Label>
                            <Input
                              required
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
                                      required
                                      type="text"
                                      value={option}
                                      onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                      data-testid={`option`}
                                    />
                                  </Col>
                                  <Col>
                                  <Label check>
                                    <Input
                                      type="checkbox"
                                      name={`multipleOption${index}`}
                                      style={{ display: 'none' }} 
                                      checked={checkCorrect(index, optionIndex) > -1}
                                      onChange={() => handleMultipleCorrectOptionChange(index, optionIndex)}
                                    />
                                    {' '}
                                    <i
                                      className={`bi ${checkCorrect(index, optionIndex)  > -1 ? 'bi-check-square-fill' : 'bi-check-square'}`}
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
                            required
                            type="text"
                            id={`question${index}`}
                            value={pair.question}
                            onChange={(e) => handlePairChange(index, 'question', e.target.value)}
                            data-testid={`option${index}`}
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
                                    required
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
                                      data-testid={`correct`}
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
                            required
                            type="text"
                            id={`question${index}`}
                            value={pair.question}
                            onChange={(e) => handlePairChange(index, 'question', e.target.value)}
                            data-testid={`answer`}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for={`answer${index}`}>Atsakymas</Label>
                          <Input
                           required
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
                disabled={pairs.length >= 15}
              >
              <i class="bi bi-plus-lg"></i> Pridėti klausimą
              </Button>
              <FormGroup>
                <Button type="submit"  style={{backgroundColor: 'black', color: 'white', border: 'none', marginTop: '10px'}} className="submit-button">
                  Įrašyti
                </Button>
                {successMessage && <div style={{ marginBottom: '10px', color: successMessage.includes('Klaida') ? 'red' : 'green' }}>{successMessage}</div>}
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default AddHomework;
