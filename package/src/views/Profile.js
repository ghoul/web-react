// // // import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap";
// // // import kids from "../assets/images/users/kids.jpg";
// // // const About = () => {
// // //   return (
// // //     <Row>
// // //       <Col>
// // //         <Card>
// // //           <CardTitle tag="h6" className="border-bottom p-3 mb-0">
// // //             <i className="bi bi-bell me-2"> </i>
// // //             APIE MUS
// // //           </CardTitle>
// // //           <CardBody className="p-4">
// // //             <Row >
// // //               <Col lg="8">
// // //               <center>
// // //                 <h2 className="mt-4">¡¡ YOYO VISI RENKASI YOYO !!</h2>
// // //                <h5 className=" center">
// // //                   Yoyo triukai visada buvo ir bus būdas nusakyti, kurie žmonės yra kieti, o kurie ne. 
// // //                   Prisijunk prie kietų žmonių jau dabar!
// // //                 </h5>
// // //                 <img
// // //                   src={kids}
// // //                   alt="my"
// // //                   width={1000}
// // //                 />
// // //                 <br />
// // //                 </center>
// // //               </Col>
// // //             </Row>
// // //           </CardBody>
// // //         </Card>
// // //       </Col>
// // //     </Row>
// // //   );
// // // };

// // // export default About;
// // import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
// // import kids from "../assets/images/users/kids.jpg";

// // const About = () => {
// //   return (
// //     <div>
// //       <Row className="justify-content-center">
// //         <Col lg="10">
// //           <Card>
// //             <CardTitle tag="h6" className="border-bottom p-3 mb-0">
// //               <i className="bi bi-bell me-2"></i>
// //               APIE MUS
// //             </CardTitle>
// //           </Card>
// //         </Col>
// //       </Row>
// //       <Row className="justify-content-center mt-4">
// //         <Col lg="10">
// //           <Card>
// //             <CardBody className="p-4">
// //               <center>
// //                 <h2>¡¡ YOYO VISI RENKASI YOYO !!</h2>
// //                 <h5>
// //                   Yoyo triukai visada buvo ir bus būdas nusakyti, kurie žmonės yra kieti, o kurie ne.
// //                   Prisijunk prie kietų žmonių jau dabar!
// //                 </h5>
// //                 <img src={kids} alt="my" width="100%" max-width="1000" />
// //               </center>
// //             </CardBody>
// //           </Card>
// //         </Col>
// //       </Row>
// //     </div>
// //   );
// // };

// // export default About;

// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// function Profile() {
//   const [name, setName] = useState('');
//   const [surname, setSurname] = useState('');
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Perform validation (client-side)

//     // Send updated data to the server
//     try {
//       const response = await fetch('/update-profile', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name, surname, password, email }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update profile');
//       }

//       const result = await response.json();
//       // Handle success, e.g., show a success message
//       console.log('Profile updated successfully', result);
//     } catch (error) {
//       // Handle errors, e.g., show an error message
//       console.error('Error updating profile', error);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h1>User Profile</h1>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label htmlFor="name" className="form-label">
//             Name
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="name"
//             placeholder="Enter your name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="surname" className="form-label">
//             Surname
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="surname"
//             placeholder="Enter your surname"
//             value={surname}
//             onChange={(e) => setSurname(e.target.value)}
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="password" className="form-label">
//             Password
//           </label>
//           <input
//             type="password"
//             className="form-control"
//             id="password"
//             placeholder="Enter new password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="email" className="form-label">
//             Email
//           </label>
//           <input
//             type="email"
//             className="form-control"
//             id="email"
//             placeholder="Enter new email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <button type="submit" className="btn btn-primary">
//           Update Profile
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Profile;

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BACKEND_URL from '../layouts/config';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
function Profile() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  let token = localStorage.getItem('token'); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/user_data/`, {
          method: 'GET',
          headers: {
            'Authorization' : `${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        console.log(userData.data);
        setName(userData.data[0].name);
        setSurname(userData.data[0].surname);
        setEmail(userData.data[0].email);
        console.log(name);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      name,
      surname,
      email
    };

    try {
      const response = await fetch(`${BACKEND_URL}/user_data/`, {
        method: 'PUT',
        headers: {
          'Authorization' : `${token}`,
          'Content-Type': 'application/json',
        },
          body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      localStorage.setItem('token', result.token);
      setMessage(result.success ? 'Profile updated successfully' : 'Failed to update profile');
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile', error);
      setMessage('Failed to update profile');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Profilio redagavimas</h1>
      {message && <div style={{ color: message.includes('Failed') ? 'red' : 'green' }}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Vardas
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Vardas..."
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="surname" className="form-label">
            Pavardė
          </label>
          <input
            type="text"
            className="form-control"
            id="surname"
            placeholder="Pavardė..."
            value={surname}
            required
            onChange={(e) => setSurname(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            El. paštas
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="El. paštas..."
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>      
        <button type="submit" className="btn btn-primary">
          Išsaugoti pakeitimus
        </button>
      </form>
      <br></br>
      <Button><Link to={`/password`} className="nav-link" style={{ color: 'white' }}>Keisti slaptažodį → </Link></Button>
      <br></br><br></br>
      <Button><Link to={`/`} className="nav-link" style={{ color: 'white' }}> ← Atgal </Link></Button>
    </div>
  );
}

export default Profile;
