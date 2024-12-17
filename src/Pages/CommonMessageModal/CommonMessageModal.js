import { Modal, Button } from "react-bootstrap";

const CommonMessageModal = ({ show, onHide,message }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {message}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CommonMessageModal;
