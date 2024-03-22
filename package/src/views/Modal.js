import React from "react";
import './Modal.css';
import {Row, Col} from "reactstrap";


export const Modal = (props) => {
 return (
  <>
    {props.show && <div className="backdrop" onClick={props.hide} />}
    <div className={`modall ${props.show ? 'show' : 'hide'}`}>
      <Row>
      <p>{props.question ? props.question : "Ar tikrai norite pašalinti?" }</p>
      </Row>
      <Row>
        <Col>
      <button className="button" onClick={props.onConfirm}>
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

  
  
  

