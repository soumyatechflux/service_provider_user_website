import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import "./ContactPage.css";
import MessageModal from "../MessageModal/MessageModal";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    message: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Perform custom form validation
    if (!formData.name.trim()) {
      setMessage("Name is required.");
      handleShow();
      return;
    }
    if (!formData.mobile.trim()) {
      setMessage("Mobile number is required.");
      handleShow();
      return;
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      setMessage("Enter a valid 10-digit mobile number.");
      handleShow();
      return;
    }
    if (!formData.email.trim()) {
      setMessage("Email is required.");
      handleShow();
      return;
    }
    if (!formData.city.trim()) {
      setMessage("City is required.");
      handleShow();
      return;
    }
    if (!formData.message.trim()) {
      setMessage("Message is required.");
      handleShow();
      return;
    }
  
    try {
      const payload = {
        support: {
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          city: formData.city,
          description: formData.message,
        },
      };
  
      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/support/add`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("API Response:", response.data);
  
      setShowPopup(true);
  
      // Clear the form fields after submission
      setFormData({
        name: "",
        mobile: "",
        email: "",
        city: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const [expandedSection, setExpandedSection] = useState("a");

  const faqSections = {
    a: {
      title: "A. Booking process related faqs",
      items: [
        "Why can't I complete my booking?",
        "What should I do if no partner is assigned to my booking?",
        "How do I know my booking is confirmed?",
      ],
    },
    b: {
      title: "B. Payment related faqs",
      items: [
        "What payment methods are accepted?",
        "Is advance payment required?",
        "How do I get a refund?",
      ],
    },
    c: {
      title: "C. Refund and cancellation faqs",
      items: [
        "What is the cancellation policy?",
        "How long does a refund take?",
        "Can I reschedule my booking?",
      ],
    },
    d: {
      title: "D. Safety issues faqs",
      items: [
        "Are the service providers verified?",
        "What safety measures are in place?",
        "How do I report an issue?",
      ],
    },
  };

  return (
    <>
      <div className="container nav-container contact-page">
        <div className="content-wrapper">
          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <div className="contact-form">
              <h2 className="contact-title">Get In Touch</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group mobile-input">
                  <span className="country-code">+91</span>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  >
                    <option value="">City</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="delhi">Delhi</option>
                    <option value="bangalore">Bangalore</option>
                  </select>
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  Send Now
                </button>
              </form>
            </div>

            {/* Popup */}
            {showPopup && (
              <div className="popup-overlay">
                <div className="popup">
                  <h2>Thank You!</h2>
                  <p>Your message has been successfully sent.</p>
                  <button className="close-btn" onClick={closePopup}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* FAQ Section */}
          <div className="faq-wrapper">
            <div className="faq-section">
              <h2>
                <span className="back-arrow">‹</span>
                How Can We Help You?
              </h2>
              {Object.entries(faqSections).map(([key, section]) => (
                <div key={key} className="faq-category">
                  <button
                    className="category-header"
                    onClick={() =>
                      setExpandedSection(expandedSection === key ? "" : key)
                    }
                  >
                    <span>{section.title}</span>
                    {expandedSection === key ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  <div
                    className={`category-content ${
                      expandedSection === key ? "expanded" : ""
                    }`}
                  >
                    {section.items.map((item, index) => (
                      <div key={index} className="faq-item-contact">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <MessageModal
          show={show}
          handleClose={handleClose}
          handleShow={handleShow}
          message={message}
        />
      </div>
    </>
  );
}

export default ContactPage;
