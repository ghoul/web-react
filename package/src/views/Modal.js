// import { Fragment } from "react";
// import './Modal.css';
// // import './Style.css';

// export const Modal = (props) => {

//     const cssClasses = ["backdrop", props.show ? "show" : "hide"];
//     const cssClassesModal = ["modal", props.show ? "show" : "hide"];
//     console.log('Modal Props:', props);
  
//     const deleteHandler = () => {
//       props.onRemoveProduct();
//     };
  
//     return (
//       <Fragment>
//         <div onClick={props.hide} className={cssClasses.join(" ")}></div>
//         <div className={`modal show`}>
//           <p>Ar tikrai norite pašalinti?</p>
//           <button className="button" onClick={deleteHandler}>
//             Taip
//           </button>
//           <button className="button" onClick={props.hide}>
//             Ne
//           </button>
//         </div>
//       </Fragment>
//     );
//   };
  
import React from "react";
import './Modal.css';
import { Button, Card, CardTitle, CardBody, Row, Col, CardSubtitle,Table , Label, Input} from "reactstrap";


export const Modal = (props) => {
 // console.log('Modal Props:', props);
 console.log(`modal ${props.show ? "show" : "hide"}`);

 return (
  <>
    {props.show && <div className="backdrop" onClick={props.hide} />}
    <div className={`modall ${props.show ? 'show' : 'hide'}`}>
      <Row>
      <p>Ar tikrai norite pašalinti?</p>
      </Row>
      <Row>
        <Col>
      <button className="button" onClick={props.onRemoveProduct}>
        Taip
      </button>
      </Col>
      <Col>
      <button className="button" onClick={props.hide}>
        Ne
      </button>
      </Col>
      </Row>
    </div>

  </>
);

};

  
  
  

