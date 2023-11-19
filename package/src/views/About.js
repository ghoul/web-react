// import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap";
// import kids from "../assets/images/users/kids.jpg";
// const About = () => {
//   return (
//     <Row>
//       <Col>
//         <Card>
//           <CardTitle tag="h6" className="border-bottom p-3 mb-0">
//             <i className="bi bi-bell me-2"> </i>
//             APIE MUS
//           </CardTitle>
//           <CardBody className="p-4">
//             <Row >
//               <Col lg="8">
//               <center>
//                 <h2 className="mt-4">¡¡ YOYO VISI RENKASI YOYO !!</h2>
//                <h5 className=" center">
//                   Yoyo triukai visada buvo ir bus būdas nusakyti, kurie žmonės yra kieti, o kurie ne. 
//                   Prisijunk prie kietų žmonių jau dabar!
//                 </h5>
//                 <img
//                   src={kids}
//                   alt="my"
//                   width={1000}
//                 />
//                 <br />
//                 </center>
//               </Col>
//             </Row>
//           </CardBody>
//         </Card>
//       </Col>
//     </Row>
//   );
// };

// export default About;
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import kids from "../assets/images/users/kids.jpg";

const About = () => {
  return (
    <div>
      <Row className="justify-content-center">
        <Col lg="10">
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              <i className="bi bi-bell me-2"></i>
              APIE MUS
            </CardTitle>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        <Col lg="10">
          <Card>
            <CardBody className="p-4">
              <center>
                <h2>¡¡ YOYO VISI RENKASI YOYO !!</h2>
                <h5>
                  Yoyo triukai visada buvo ir bus būdas nusakyti, kurie žmonės yra kieti, o kurie ne.
                  Prisijunk prie kietų žmonių jau dabar!
                </h5>
                <img src={kids} alt="my" width="100%" max-width="1000" />
              </center>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default About;


