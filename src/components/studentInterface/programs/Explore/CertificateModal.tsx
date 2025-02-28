import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

interface CertificateModalProps {
  open: boolean;
  onClose: () => void;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ open, onClose }) => {
  // Example certificate URLs (Place your files in the public folder)
  const certificate35PDUsUrl = "/certificates/35PDUs-certificate.pdf"; // Auto-downloadable

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="certificate-modal-title"
      aria-describedby="certificate-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          boxShadow: 24,
          p: 3,
          borderRadius: "8px",
          // width: "80%", 
          textAlign: "center",
        }}
      >
        <Typography
          id="certificate-modal-title"
          variant="h6"
          component="h2"
          fontFamily="Inter"
          fontWeight={600}
        >
          Collect Your Certificate
        </Typography>

        <Typography
          id="certificate-modal-description"
          sx={{ mt: 2 }}
          fontSize={14}
          fontFamily="Inter"
        >
          Please select the type of certificate you need.
        </Typography>

        {/* 35 PDUs Certificate - Auto Download */}
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3, width: "100%" }}
          component="a"
          href={certificate35PDUsUrl}
          download="35PDUs-certificate.pdf"
        >
          Download 35 PDUs Certificate
        </Button>

        {/* 60 PDUs Certificate - Contact Support */}
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mt: 2, width: "100%" }}
          onClick={() => window.location.href = "mailto:engme-team@example.com"}
        >
          Contact EngMe Team for 60 PDUs
        </Button>

        {/* Engineering CRT Certificate - Contact Support */}
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mt: 2, width: "100%" }}
          onClick={() => window.location.href = "mailto:engme-support@example.com"}
        >
          Contact EngMe Team for Engineering CRT
        </Button>

        {/* Close Button */}
        <Button variant="text" sx={{ mt: 3 }} onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default CertificateModal;
