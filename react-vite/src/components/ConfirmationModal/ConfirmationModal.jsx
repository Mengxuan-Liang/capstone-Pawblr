import React from 'react';
import './ConfirmationModal.css'; // You can add your styles here

function ConfirmationModal({ show, onClose, onConfirm, message }) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{textAlign:'center'}}>
        <p>{message}</p>
        <br></br>
        <div className="modal-buttons">
          <button onClick={onConfirm} style={{padding:'10px 15px', borderRadius:'7px'}}>Yes</button>
          {' '}
          <button onClick={onClose} style={{padding:'10px 15px', borderRadius:'7px'}}>No</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
