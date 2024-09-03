import React from 'react';
import './ConfirmationModal.css'; 

function ConfirmationModal({ show, onClose, onConfirm, message }) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{textAlign:'center'}}>
        <p style={{fontWeight:'bold',fontSize:"x-large"}}>{message}</p>
        <br></br>
        <div className="modal-buttons">
          <button onClick={onConfirm} style={{padding:'10px 15px', borderRadius:'7px', border:'none',backgroundColor:'rgba(254, 212, 4, 255)'}}>Yes</button>
          {' '}
          <button onClick={onClose} style={{padding:'10px 15px', borderRadius:'7px', border:'none', backgroundColor:'rgba(254, 212, 4, 255)'}}>No</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
