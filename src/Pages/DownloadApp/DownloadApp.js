import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./DownloadApp.css";
import { FaEnvelope } from "react-icons/fa";

const DownloadApp = () => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const handleOpenModal = (msg) => {
    setMessage(msg);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="Download-container">
      <div className="container nav-container download-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 content-col">
              <div>
                <h2
                  className="download-title"
                  style={{
                    fontSize: "36px",
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  Download The App
                </h2>
                <p className="download-text" style={{ color: "white", fontWeight:"700" }}>
                  Download the Servyo app on Android & iOS. Get access to all our services on your fingertips for a smooth and hassle-free experience
                </p>
                <div className="store-buttons">
                  <a
                    href="#! "
                    className="store-button google-play"
                    // onClick={(e) => {
                    //   e.preventDefault(); // Prevent default action of anchor tag
                    //   handleOpenModal("App coming soon! Stay tuned.");
                    // }}
                     onClick={() => {
                     // window.open("https://play.google.com/store/apps/details?id=com.servyo.user", "_blank");
                     window.open("https://play.google.com/store/apps/details?id=com.servyo.user&hl=en", "_blank");
                     window.scrollTo({
                     top: document.body.scrollHeight,
                     behavior: "smooth",
                   });
                 }}
                  >
                    <img
                      src="/DownloadApp/Google_Play_Store.png"
                      alt="Get it on Google Play"
                      className="store-img"
                    />
                  </a>
                  <a
                    href="#!" // Use a dummy href as you are not navigating directly
                    className="store-button app-store"
                    // onClick={(e) => {
                    //   e.preventDefault(); // Prevent default action of anchor tag
                    //   handleOpenModal("App coming soon! Stay tuned.");
                    // }}
                     onClick={() => {
                    window.open("https://apps.apple.com/in/app/servyo/id6746445188", "_blank");
                    window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                    });
                   }}
                  >
                    <img
                      src="/DownloadApp/AppStore.png"
                      alt="Download on the App Store"
                      className="store-img"
                    />
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="img-phone">
                <img src="/DownloadApp/downloadApp.png" alt="Phone Display" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        {/* <Modal.Header closeButton /> */}
        <Modal.Body style={{ display: "flex", alignItems: "center" }}>
          <FaEnvelope
            style={{
              color: "#6366f1",
              marginRight: "10px",
              fontSize: "2em",
            }}
          />
          {message}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="button-message"
            variant="primary"
            onClick={handleCloseModal}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DownloadApp;
