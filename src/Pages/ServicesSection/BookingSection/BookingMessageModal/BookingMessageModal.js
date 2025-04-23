import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import './BookingMessageModal.css';

const BookingMessageModal = ({ show, handleClose, message }) => {
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleLoginClick = () => {
    handleClose(); // Close the modal
    navigate('/login'); // Navigate to /login
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header >
        {/* <Modal.Title>Message</Modal.Title> */}
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button
          className="button-message"
          variant="primary"
          onClick={handleLoginClick}
        >
          Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingMessageModal;
