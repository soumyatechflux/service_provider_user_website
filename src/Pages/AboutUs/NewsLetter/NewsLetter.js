// import React from "react";
// import "./NewsLetter.css";

// const NewsLetter = () => {
//   return (
//     <div className="container nav-container mt-5 ">
//       <div className="newsletter-section">
//         <h2 className="newsletter-heading">
//           Be in the Loop! Subscribe to Our Newsletter for Exclusive Offers and
//           Tips.
//         </h2>
//         <form className="newsletter-form">
//           <input
//             type="email"
//             placeholder="Email Address"
//             className="newsletter-input"
//           />
//           <button type="submit" className="newsletter-button">
//             SUBSCRIBE
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default NewsLetter;


import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./NewsLetter.css";
import MessageModal from "../../MessageModal/MessageModal";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
   const [message, setMessage] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/subscribers/add`,
        { email }
      );
      
      if (response.status === 200) {
        // toast.success("Subscription successful! Thank you for subscribing.");
        setMessage("Subscription successful! Thank you for subscribing.");
        setShow(true);
        handleShow();
        setEmail("");
      }
    } catch (error) {
      // toast.error("Subscription failed. Please try again later.");
      setMessage("Subscription failed. Please try again later.");
      setShow(true);
      handleShow();
    }
  };

  return (
    <div className="container nav-container mt-5">
      <div className="newsletter-section">
        <h2 className="newsletter-heading">
          Be in the Loop! Subscribe to Our Newsletter for Exclusive Offers and Tips.
        </h2>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            className="newsletter-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="newsletter-button">
            SUBSCRIBE
          </button>
        </form>
      </div>
      <MessageModal
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        message={message}
      />
    </div>
  );
};

export default NewsLetter;