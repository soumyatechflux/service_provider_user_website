import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import "./ContactPage.css";
import MessageModal from "../MessageModal/MessageModal";
import Loader from "../Loader/Loader";
// import Loader from "../../Loader/Loader";


function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "Delhi-NCR", // Preselect Delhi-NCR
    message: "",
  });

    const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [message, setMessage] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null); // Dropdown toggle state
  const [selectedLocation, setSelectedLocation] = useState("Delhi-NCR"); // Preselect Delhi-NCR


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    setFormData({ ...formData, city: location });
    setActiveDropdown(null); // Close the dropdown after selection
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
    if (!formData.message.trim()) {
      setMessage("Message is required.");
      handleShow();
      return;
    }
  
    try {

      
      const payload = {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        location: selectedLocation, // Change "city" to "location" to match API expectation
        message: formData.message, // Change "description" to "message" to match API expectation
      };      
      setIsSubmitting(true);
      setLoading(true);
  
      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/contactus/add`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);

      console.log("API Response:", response.data);
  
      setShowPopup(true);
  
      // Clear the form fields after submission
      setFormData({
        name: "",
        mobile: "",
        email: "",
        city: "Delhi-NCR", // Reset to predefined value
        message: "",
      });
  
      // Reset the selected location to "Select Location"
      setSelectedLocation("Select Location");
    } catch (error) {
      console.error("Error submitting form:", error);
    }finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };
  

  const closePopup = () => {
    setShowPopup(false);
  };

  const [expandedSection, setExpandedSection] = useState("a");

  const faqSections = {
    a: {
      title: "A. Booking process related FAQs",
      items: [
        {
          question: "Why can't I complete my booking?",
          answer:
            "There may be an issue with your internet connection, or the service might not be available at your selected time. Please check your details and try again.",
        },
        {
          question: "What should I do if no partner is assigned to my booking?",
          answer:
            "If your booking has not been confirmed by a partner, please consider re-booking with a different time slot or checking back later for availability.",
        },
        {
          question: "How do I know my booking is confirmed?",
          answer:
            "You will receive a booking confirmation on your app once your booking request is confirmed and a provider is assigned to you. If you received a notification that your booking is confirmed but you are not able to see the details in the app, please fill out this form with a description of your booking. Our team can confirm your booking status.",
        },
        {
          question: "I can’t find my booking history. Where is it?",
          answer:
            "Your past booking details should be available in the ‘my bookings’ section of the app. If you can’t find it, try refreshing your app or logging out and back in.",
        },
        {
          question: "Why does the app keep crashing when I try to book?",
          answer:
            "This may be due to a bug or an outdated version of the app, try reinstalling/updating the app or clear your cache.",
        },
      ],
    },
    b: {
      title: "B. Payment related FAQs",
      items: [
        {
          question: "What payment methods are accepted?",
          answer:
            "We accept the following payment methods: Cards, Net Banking, UPI, Wallets, and Cash",
        },
        {
          question: "Can I pay after the service is completed?",
          answer: "Yes, you can pay after your service is completed by cash.",
        },
        {
          question:
            "Why am I not able to make online payments? / why was my payment declined?",
          answer:
            "This can be due to various reasons which include: Incorrect information such as entering wrong card number, CVV, or UPI PIN; insufficient funds in your account; network issues that may prevent the payment from going through; card may have expired, in which case, you may need to update your card details. Please check the above before proceeding with online payment. If your issue is still unresolved, please fill out this form with a description of your concern. Our team will get back to you promptly.",
        },
        {
          question: "Is my payment information secure? ",
          answer:
            "We use data encryption and secure payment gateways to protect your payment information. Please read our privacy policy for further details.",
        },
        {
          question:
            "What if my payment has gone through but I didn’t receive a booking confirmation? ",
          answer:
            "If you haven’t received a confirmation but the payment has been processed from your bank, please fill out this form to contact customer support to resolve the discrepancy.",
        },
        {
          question: "I was charged more than my actual usage",
          answer:
            "Our systems use advanced technology and are programmed to precisely calculate the fare based on various factors as detailed in each category. If your issue is still unresolved, please fill out this form with a description of your concern. Our team will get back to you promptly.",
        },
      ],
    },
    c: {
      title: "C. Refund and cancellation FAQs",
      items: [
        {
          question:
            "What is your cancellation policy? Are there any cancellation charges?",
          answer:
            "Our cancellation policies vary by services, so please check the cancellation policy, deadlines and associated cancellation fees, when booking the service.",
        },
        {
          question: "How do I cancel my booking?",
          answer:
            "You can simply cancel by clicking the cancel button at your booking page. You might be asked to select a reason for cancellation. A nominal fee might be applicable depending on how long before the service you cancel.",
        },
        {
          question: "How long does it take to process a refund?",
          answer:
            "Refunds are typically processed within 7-15 business days. If you haven't received your refund within the expected timeframe, please fill out this form with a description of your concern. Our team will get back to you promptly.",
        },
        {
          question: "Can I modify my booking instead of canceling?",
          answer:
            "Yes, please check your booking page to edit your booking details up to a certain time before your booking starts. If you can’t see the modify option, you may need to cancel the booking and make a new booking.",
        },
        {
          question: "What happens if my booking is cancelled by the provider?",
          answer:
            "In case our provider cancels your booking, we will try our best to assign the next available provider to your booking request.",
        },
      ],
    },
    d: {
      title: "D. Safety issues FAQs",
      items: [
        {
          question: "My provider’s behaviour made me feel unsafe",
          answer:
            "We sincerely apologize for any inconvenience or discomfort you may have felt. Your safety is our first priority, and we take these reports extremely seriously. We request you to give us further information about the incident so that we can better understand the situation and make sure that your feedback is appropriately addressed. This will help us in taking the necessary action in this matter. Please fill out this form with a description of your concern. Our team will get back to you promptly.",
        },
        {
          question: "Item went missing in the presence of my provider",
          answer:
            "If any item went missing, it’s important to note that neither Servyo nor the provider can be held responsible for the items that go missing after the booking has completed, rest assured we are here to help you to the best of our abilities. We do not guarantee that our provider has your item. Please fill out this form with a description of your concern to register your complaint. Our team will get back to you promptly.",
        },
        {
          question: "My provider asked to book the service offline",
          answer:
            "Asking our customers to book a service offline is against our strict policies. Please note we will not be responsible for any issue or damage caused by the provider if you choose to book the service offline. Please fill out this form to give more details about the incident. Our team will promptly resolve the issue. We thank you for your support in following Servyo’s policies and guidelines.",
        },
        {
          question: "My driver drove dangerously",
          answer:
            "We sincerely apologize for any inconvenience or discomfort you may have felt. Your safety is our first priority, and we take these reports extremely seriously. We request you to give us further information about the incident so that we can better understand the situation and make sure that your feedback is appropriately addressed. This will help us in taking the necessary action in this matter. Please fill out this form and our team will address the issue promptly.",
        },
        {
          question: "I was involved in an accident",
          answer:
            "Your safety is our top priority. We sincerely apologize for any inconvenience you experienced. We request you to give us further information about the incident so that we can better understand the situation and make sure that your feedback is appropriately addressed. This will help us in taking the necessary action in this matter. Please fill out this form and our team will address your issue promptly.",
        },
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
              <h2 className="contact-title mb-2">Get In Touch</h2>
              <p>
              Please provide the following details to get in touch with us. Our assistance and frequently asked questions will provide you with an immediate solution{" "}
              </p>
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

                {/* Location Dropdown */}
                <div className="join-partner-form-group">
                  <div className="nav-item dropdown location-dropdown">
                    <a
                      className="nav-link dropdown-toggle location-drop"
                      href="#"
                      style={{ width: "auto", marginRight: "0px" }}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveDropdown(
                          activeDropdown === "location" ? null : "location"
                        );
                      }}
                    >
                      <div style={{ gap: "10px" }}>
                        <i className="bi bi-geo-alt-fill me-1"></i>{" "}
                        <span style={{ color: "#999999", fontSize: "16px" }}>
                          {selectedLocation || "Select Location"}{" "}
                          {/* Default location */}
                        </span>
                      </div>
                    </a>
                    {/* {activeDropdown === "location" && (
                      <div className="dropdown-menu show">
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleLocationChange("Delhi-NCR");
                          }}
                        >
                          Delhi-NCR
                        </a> */}
                        {/* <a
                          className="dropdown-item"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleLocationChange("Mumbai");
                          }}
                        >
                          Mumbai
                        </a>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleLocationChange("Bangalore");
                          }}
                        >
                          Bangalore
                        </a>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleLocationChange("Chennai");
                          }}
                        >
                          Chennai
                        </a> */}
                        {/* Add more cities as needed */}
                      {/* </div>
                    )} */}
                  </div>
                </div>

                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn"disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader /> Submitting...
              </>
            ) : (
              "Send Now"
            )}
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
                <span className="back-arrow"></span>
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
                        <p>
                          <strong>Q:</strong> {item.question} <br />
                          <strong>Ans:</strong> {item.answer}
                        </p>
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
