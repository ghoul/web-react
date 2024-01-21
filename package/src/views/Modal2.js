import React from 'react';
import './Modal2.css';

export const Modal2 = ({ showModal, handleClose }) => {
    console.log("modal2 in");
  return (
    <div className={`modal ${showModal ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <p>This is the modal content.</p>
      </div>
    </div>
  );
};
