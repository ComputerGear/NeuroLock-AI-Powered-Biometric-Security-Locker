import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  // Use a portal to render the modal at the top of the DOM tree
  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <Button onClick={onClose} className="modal-close-btn">&times;</Button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.getElementById('root') // Attaching to the same root, could also be document.body
  );
};

export default Modal;