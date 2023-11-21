import React from "react";
import { Redirect } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
// import { useAlert } from "react-alert";
import { useLocation } from "react-router-dom";
import { useParams, Link } from 'react-router-dom';
import { Modal } from "./Modal.js";
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
  Input, Table
} from "reactstrap";
import { useNavigate } from 'react-router-dom';

export default function UpdateClass() {
  const { classsId } = useParams();
  const navigate  = useNavigate();
  const [message, setMessage] = useState(''); 
  console.log("id: ", classsId);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [titleInput, settitleInput] = useState("");
  const [students, setStudents] = useState([]); 
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
        console.log("grazino title" + data.title);
      });

      fetch(
        `http://localhost:8000/handle_students_class/0/${classsId}/`,
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
          setStudents(data.students);
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
  const removeStudent = () => {
    fetch(`http://localhost:8000/handle_students_class/${selectedStudentId}/${classsId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization' : `${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response)=> {
        // if(data.success){
        // Handle success, update classes state, and close the modal
        const updatedStudents = students.filter(student => student.id !== selectedStudentId);
        setStudents(updatedStudents);
        hideModalHandler(); // Move hideModalHandler inside the .then() block
        // window.location.reload();
        console.log("pasalino studenta")
        // }
      });
      // .catch(error => {
      //   // Handle error
      //   //window.location.reload();
      //   console.error('Error deleting classs:', error);
      // });
  };
  

  const showModalHandler = (studentId) => {
    setSelectedStudentId(studentId);
    setShowModal(true);
  };

  const hideModalHandler = () => {
    setShowModal(false);
  };
  const send = (event) => {
    navigate('/all-classes');
  }
  return (
    <div>
       <Modal
        show={showModal}
        hide={hideModalHandler}
        onRemoveProduct={removeStudent}
      ></Modal>
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
          <Table>
        <thead>
          <tr>
            <th>Vardas</th>
            <th>Pavardė</th>
            <th>Šalinti</th>
          </tr>
        </thead>
        <tbody>
        {students.length === 0 ? (
          <tr>
            <td colSpan="3">Klasė tuščia</td>
          </tr>
        ) : (
          students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.surname}</td>
              <td>
                <Button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => showModalHandler(student.id)}>
                  X
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
      </Table>
      <Button style={{ backgroundColor: '#204963', marginRight: '10px' }}>
                  <Link to={`/add-students/${classsId}`} className="nav-link" style={{ color: 'white' }}>
                    Pridėti +
                  </Link>
                </Button>
        </Row>
      </div>
  );
}
