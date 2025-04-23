import React from "react";
import { Modal, Button } from "react-bootstrap";

interface DeleteQuestionModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
}

const DeleteQuestionModal: React.FC<DeleteQuestionModalProps> = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this question?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteQuestionModal;
