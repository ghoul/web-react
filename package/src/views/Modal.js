import { Fragment } from "react";
import './Modal.css';

export const Modal = (props) => {
    const cssClasses = ["backdrop", props.show ? "show" : "hide"];
    const cssClassesModal = ["modal", props.show ? "show" : "hide"];
  
    const deleteHandler = () => {
      props.onRemoveProduct();
    };
  
    return (
      <Fragment>
        <div onClick={props.hide} className={cssClasses.join(" ")}></div>
        <div className={cssClassesModal.join(" ")}>
          <p>Ar tikrai norite pašalinti?</p>
          <button className="button" onClick={deleteHandler}>
            Taip
          </button>
          <button className="button" onClick={props.hide}>
            Ne
          </button>
        </div>
      </Fragment>
    );
  };
  
  
  
  
  

