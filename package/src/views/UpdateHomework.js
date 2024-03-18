import React, { useState, useEffect } from 'react';
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
import BACKEND_URL from '../layouts/config';
import { useNavigate, useParams } from 'react-router-dom';
import './Style.css';
import Cookies from 'js-cookie';
import axios from 'axios';
const UpdateHomework = () => {
const {homeworkId }= useParams();
  const [homeworkName, setHomeworkName] = useState('');
  const [pairs, setPairs] = useState([{ id: null, qtype: 'write', question: '', answer: '', points: 0, options: [], correct_options: [] }]);
  const [successMessage, setSuccessMessage] = useState('');
  const [correctOptionIndexes, setCorrectOptionIndexes] = useState(Array(pairs.length).fill(null));
const [multipleOptionIndexes, setMultipleOptionIndexes] = useState([]);
  const navigate = useNavigate();
  const token = Cookies.get('token'); 
  const mapNumericToText = (numericType) => {
    console.log("qtype: " + numericType);
    switch (numericType) {
      case 1:
        return 'select';
      case 2:
        return 'write';
      case 3:
        return 'multiple';
      default:
        return 'unknown';  // Handle any unexpected values
    }
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
          console.log("title" + response.data.title);
          console.log(response.data);
          //setLoggedId(response.data.id);

            // Set homework details in the state to pre-fill the form
            const data = response.data;
            setHomeworkName(data.title);
            // console.log("hw name: " + homeworkName);

            // Pre-fill question-answer pairs, if available
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


               // Set initial values for correctOptionIndexes and multipleOptionIndexes
               const initialCorrectOptionIndexes = data.pairs.map((pair, index) => {
                if (pair.qtype === 1) { // Assuming 'select' is represented by type 1
              //   //TODO: SELECT 
              const correctOptionIndex = pair.options.findIndex(option => pair.correct_options.some(correctOption => correctOption.id == option.id));

                  console.log(correctOptionIndex);
                  return correctOptionIndex !== -1 ? correctOptionIndex : null;
                }

                 else {
                  return null; // For other types
                }
              });
              
              const initialMultipleOptionIndexes = data.pairs.flatMap((pair, qid) => {
                if (pair.qtype === 3) { // Assuming 'multiple' is represented by type 3
                  //console.log(pair.correct_options);
                  return pair.options.map((option, oid) => ({
                    qid,
                    oid,
                    selected: pair.correct_options.some(correctOption => correctOption.id === option.id)
                  }))
                  .filter((pair) => pair.selected);
                  
                } else {
                  return [];
                }
              });
              
          //  console.log(multipleOptionIndexes);
            setCorrectOptionIndexes(initialCorrectOptionIndexes);
            setMultipleOptionIndexes(initialMultipleOptionIndexes);
            console.log(initialCorrectOptionIndexes);
            console.log(initialMultipleOptionIndexes);
          
            }
         else {
          console.error('Failed to fetch homework details');
      }});
      } catch (error) {
        console.error('Error:', error);
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
          updatedIndexes[index] = null; // Reset correct option index for select questions
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
  const handleImageChange = (index, event) => {
    const updatedPairs = [...pairs];
    updatedPairs[index].image = event.target.files[0];
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

    // Reset additional fields when changing the question type
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
    if (pairs.length > 0 && pairs.some(pair => pair.question.trim() !== '')) { //&& pair.answer.trim() !== ''
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
        axios.put(`${BACKEND_URL}/homework/${homeworkId}/`, dataToSend,  {
          headers: {
            'Authorization': `Token ${token}`,
            'X-CSRFToken': Cookies.get('csrftoken')
          }
        }).then(response => {
          
          console.log("response");

        if (response.status == 201) {
         
            setSuccessMessage(response.data.message);
          }
         else {
          console.error('Failed to submit homework');
        }
      });
    } catch (error) {
        console.error('Error:', error);
      }
    } 
  else {
    alert('Namų darbe privalo būti bent viena užduotis');
  }
}

  const handleOptionChange = (index, optionIndex, value) => {
    const updatedPairs = [...pairs];
    console.log(updatedPairs[index].options);
    updatedPairs[index].options[optionIndex] = value;
    setPairs(updatedPairs);
    console.log(updatedPairs[index].options);
  };

  const checkCorrect = (qid, oid) =>{
    const existingEntryIndex = multipleOptionIndexes.findIndex(entry => entry.qid === qid && entry.oid === oid);
    return existingEntryIndex !== -1;
  }
  const handleCorrectOptionChange = (index, value) => {
    const updatedCorrectOptionIndexes = [...correctOptionIndexes];
    updatedCorrectOptionIndexes[index] = value;
    setCorrectOptionIndexes(updatedCorrectOptionIndexes);
    console.log(updatedCorrectOptionIndexes);
  };

  //TODO: KARTAIS GRYBAUJA
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
    console.log(updatedMultipleOptionIndexes);
 
    // console.log(pairs);
  };

//   const handleMultipleCorrectOptionChange = (index, value) => { //qid ir oid
//   const updatedMultipleOptionIndexes = [...multipleOptionIndexes];
//   const existingEntryIndex = updatedMultipleOptionIndexes.findIndex(entry => entry.qid === index && entry.oid === value);

//   if (existingEntryIndex !== -1) {
//     // If the entry exists, remove it (uncheck)
//     updatedMultipleOptionIndexes.splice(existingEntryIndex, 1);
//   } else {
//     // If the entry doesn't exist, add it (check)
//     updatedMultipleOptionIndexes.push({ qid: index, oid: value });
//   }

//   setMultipleOptionIndexes(updatedMultipleOptionIndexes);
//   console.log(updatedMultipleOptionIndexes);
// };
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
            {successMessage && <div style={{ marginBottom: '10px', color: successMessage.includes('Klaida') ? 'red' : 'green' }}>{successMessage}</div>}
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
                              type="number"
                              id={`points${index}`}
                              value={pair.points}
                              onChange={(e) => handlePairChange(index, 'points', e.target.value)}
                              min="0"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <FormGroup>
                            <Label for={`question${index}`}>Klausimas</Label>
                            <Input
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
                                               {console.log(correctOptionIndexes)}
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
              onClick={addPair} className="add-pair-button"
              disabled={pairs.length >= 15}>
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


export default UpdateHomework;
