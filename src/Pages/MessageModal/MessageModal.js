// import React from "react";
// import { Modal, Button } from "react-bootstrap";
// import './MessageModal.css'
// import { FaComment } from "react-icons/fa";
// import { FaCloud } from "react-icons/fa";

// const MessageModal = ({ show, handleClose, message }) => {
//   return (
//     <Modal show={show} onHide={handleClose} centered>
// <Modal.Header closeButton>
//   {/* <FaComment style={{ color: "lightblue", marginRight: "10px", fontSize: "1.5em" }} />  */}
//   <FaCloud style={{ color: "skyblue", marginRight: "10px", fontSize: "2em" }} />

// </Modal.Header>
//       <Modal.Body>{message}</Modal.Body>
//       <Modal.Footer>
//         <Button className="button-message" variant="primary" onClick={handleClose}>
//           Ok
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default MessageModal;




import React from "react";
import { Modal, Button } from "react-bootstrap";
import './MessageModal.css';
import { FaEnvelope } from "react-icons/fa";

const MessageModal = ({ show, handleClose, message }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      {/* <Modal.Header closeButton>
      
      </Modal.Header> */}
      <Modal.Body style={{display:"flex", alignItems:"center"}}>  <FaEnvelope style={{ color: "#6366f1", marginRight: "10px", fontSize: "2em" }} />{message}</Modal.Body>
      <Modal.Footer>
        <Button className="button-message" variant="primary" onClick={handleClose}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MessageModal;