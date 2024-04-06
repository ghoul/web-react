import React, { useState, useEffect } from 'react';
import {Row, Col, Card, CardTitle, CardBody, Button, Form, FormGroup, Label, Input} from 'reactstrap';
import BACKEND_URL from '../layouts/config';
import { useNavigate, useParams } from 'react-router-dom';
import './Style.css';
import Cookies from 'js-cookie';
import axios from 'axios';
const UpdateHomework = () => {
  const {homeworkId }= useParams();
  const [homeworkName, setHomeworkName] = useState('');
  const [pairs, setPairs] = useState([{ id: null, qtype: 'write', question: '', answer: '', points: 0, options: [], correct_options: [] }]);
  const [successMessage, setMessage] = useState('');
  const [correctOptionIndexes, setCorrectOptionIndexes] = useState(Array(pairs.length).fill(null));
  const [multipleOptionIndexes, setMultipleOptionIndexes] = useState([]);
  const navigate = useNavigate();
  const token = Cookies.get('token'); 

  const mapNumericToText = (numericType) => {
    const numericToTextMap = { 1: 'select', 2: 'write', 3: 'multiple'};
    return numericToTextMap[numericType] || 'unknown';
  };

  useEffect(() => {
    const fetchHomeworkDetails = async () => {
      try {
       axios.get(`${BACKEND_URL}/homework/${homeworkId}/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'X-CSRFToken': Cookies.get('csrftoken')
          },
        }).then(response => {
            const data = response.data;
            setHomeworkName(data.title);
            if (data.pairs && data.pairs.length > 0) {
              setPairs(data.pairs.map(pair => ({
                id: pair.id,
                qtype: mapNumericToText(pair.qtype),
                question: pair.question,
                answer: pair.answer,
                points: pair.points,
                options: pair.options.map(option => option.text),
                correct_options: pair.correct_options.map(option => option.text)
              })))

               const initialCorrectOptionIndexes = data.pairs.map((pair, index) => {
               if (pair.qtype === 1) {
                    const correctOptionIndex = pair.options.findIndex(option => pair.correct_options.some(correctOption => correctOption.id == option.id));
                    return correctOptionIndex !== -1 ? correctOptionIndex : null;
                }
                 else {
                  return null;
                }
              });
              
              const initialMultipleOptionIndexes = data.pairs.flatMap((pair, qid) => {
                if (pair.qtype === 3) { 
                  return pair.options.map((option, oid) => ({ qid, oid,
                    selected: pair.correct_options.some(correctOption => correctOption.id === option.id)
                  }))
                  .filter((pair) => pair.selected);
                } else {
                  return [];
                }
              });
            
            setCorrectOptionIndexes(initialCorrectOptionIndexes);
            setMultipleOptionIndexes(initialMultipleOptionIndexes);         
            }
         else {
          console.error('Klaida');
      }});
      } catch (error) {
        console.error('Klaida:', error);
      }
    };

    fetchHomeworkDetails();
  }, [homeworkId, token]);

  const handleHomeworkNameChange = (e) => {
    setHomeworkName(e.target.value);
  };
  const handlePairChange = (index, field, value) => {
    const updatedPairs = [...pairs];
    updatedPairs[index][field] = value;
    if (field === 'qtype') {
      if (value === 'select' || value === 'write') {
        setCorrectOptionIndexes(prevIndexes => {
          const updatedIndexes = [...prevIndexes];
          updatedIndexes[index] = null; 
          return updatedIndexes;
        });
      } else if (value === 'multiple') {
        setMultipleOptionIndexes(prevIndexes => {
          const updatedIndexes = prevIndexes.filter(entry => entry.qid !== index);
          return updatedIndexes;
        });
      }
    }
    setPairs(updatedPairs);
  };

  const addPair = () => {
    setPairs([...pairs, { question: '', answer: '', options: [], points : 0, qtype : 'select' }]);
  };

  const removePair = (index) => {
    const updatedPairs = [...pairs];
    updatedPairs.splice(index, 1);
    setPairs(updatedPairs);
  };
  const handleTypeChange = (index, newType) => {
    const updatedPairs = [...pairs];
    updatedPairs[index].qtype = newType;

    if (newType === 'select' || newType === 'write') {
      setCorrectOptionIndexes(prevIndexes => {
        const updatedIndexes = [...prevIndexes];
        updatedIndexes[index] = null;
        return updatedIndexes;
      });
    } else if (newType === 'multiple') {
      setMultipleOptionIndexes(prevIndexes => {
        const updatedIndexes = prevIndexes.filter(entry => entry.qid !== index);
        return updatedIndexes;
      });
    }
    setPairs(updatedPairs);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasEmptyPoints = pairs.some(pair => pair.points === 0);
    if(hasEmptyPoints){
      setMessage('Klaida! Nenustatyti taškai');
      return;
    }

    if (pairs.length > 0 && pairs.some(pair => pair.question.trim() !== '')) {
      const dataToSend = {
        title: homeworkName,
        correct: correctOptionIndexes,
        multiple: multipleOptionIndexes,
        pairs: pairs.map(pair => ({
          id: pair.id,
          qtype: pair.qtype,
          question: pair.question,
          answer: pair.answer,
          points: pair.points,
          options: pair.options   
        }))
      };
      try {
        const response = await axios.put(`${BACKEND_URL}/homework/${homeworkId}/`, dataToSend,  {
          headers: {
            'Authorization': `Token ${token}`,
            'X-CSRFToken': Cookies.get('csrftoken')
          }
        });

        if (response.status == 201) {
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
    } 
  else {
    setMessage('Klaida! Namų darbe privalo būti bent viena užduotis');
  }
}

  const handleOptionChange = (index, optionIndex, value) => {
    const updatedPairs = [...pairs];
    updatedPairs[index].options[optionIndex] = value;
    setPairs(updatedPairs);
  };

  const checkCorrect = (qid, oid) =>{
    const existingEntryIndex = multipleOptionIndexes.findIndex(entry => entry.qid === qid && entry.oid === oid);
    return existingEntryIndex;
  }
  const handleCorrectOptionChange = (index, value) => {
    const updatedCorrectOptionIndexes = [...correctOptionIndexes];
    updatedCorrectOptionIndexes[index] = value;
    setCorrectOptionIndexes(updatedCorrectOptionIndexes);
  };

  const handleMultipleCorrectOptionChange = (index, value) => {
    const updatedMultipleOptionIndexes = [...multipleOptionIndexes];
    const existingEntryIndex = checkCorrect(index,value) 
    if (existingEntryIndex>-1) {
      updatedMultipleOptionIndexes.splice(existingEntryIndex, 1);
    } else {
      updatedMultipleOptionIndexes.push({ qid: index, oid: value });
    }
    setMultipleOptionIndexes(updatedMultipleOptionIndexes);
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
  const send = () => {
    navigate(`/check-homework/${homeworkId}`);
  };

  return (
    <Row>
      <Col>
        <Button style={{ backgroundColor: '#1b1c20', color: 'white', marginBottom: '10px' }} onClick={send}> ← Atgal</Button>
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-pen me-2"></i>
            Namų darbo redagavimo forma
          </CardTitle>
          <CardBody>
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
                  <Card key={index} className="pair-card">
                    <CardBody>
                      <Row>
                        <Col>
                          <FormGroup>
                            <Label for={`qtype${index}`}>Užduotis nr. {index + 1}</Label>
                            <Input
                              type="select"
                              id={`qtype${index}`}
                              value={pair.qtype}
                              onChange={(e) => handleTypeChange(index, e.target.value)}
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
                              data-testid = {`points${index}`}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
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
                      {pair.qtype === 'write' && (
                        
                        <div>                   
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
                          <Button type="button" style={{backgroundColor: '#bf1a2f', color: 'white', border: 'none'}} onClick={() => removePair(index)}>
                    <i class="bi bi-dash-lg"></i> Ištrinti
                    </Button>
                        </div>
                      )}
                        {pair.qtype === 'select' && (
                                <div>
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
                                  <Button type="button" style={{backgroundColor: '#bf1a2f', color: 'white', border: 'none'}} onClick={() => removePair(index)}>
                                  <i class="bi bi-dash-lg"></i> Ištrinti
                                  </Button>
                                </div>
                              )}
                       {pair.qtype === 'multiple' && (
                        <div>
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
                                      type="checkbox"
                                      name={`multipleOption${index}`}
                                      style={{ display: 'none' }} 
                                      checked={checkCorrect(index, optionIndex) > -1}
                                      onChange={() => handleMultipleCorrectOptionChange(index, optionIndex)}
                                    />
                                    {' '}
                                    <i
                                      className={`bi ${checkCorrect(index, optionIndex) > -1 ? 'bi-check-square-fill' : 'bi-check-square'}`}
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
                          <Button type="button" style={{backgroundColor: '#bf1a2f', color: 'white', border: 'none'}} onClick={() => removePair(index)}>
                    <i class="bi bi-dash-lg"></i> Ištrinti
                    </Button>
                        </div>
                      )}
                </CardBody>
                </Card>
                </div>
                ))} 
             
              <Button type="button" style={{backgroundColor: '#a6d22c', color: 'white', border: 'none'}} 
              onClick={addPair} disabled={pairs.length >= 15}>
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

export default UpdateHomework;