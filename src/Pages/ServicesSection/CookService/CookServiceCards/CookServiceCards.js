import React, { useEffect, useState } from "react";
import "./CookServiceCards.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../../Loader/Loader";
import MessageModal from "../../../MessageModal/MessageModal";
import ServiceDetailsModal from "../../ServiceDetailsModal/ServiceDetailsModal";
import BookingMessageModal from "../../BookingSection/BookingMessageModal/BookingMessageModal";

const CookServiceCards = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState([]);
  const [viewMoreStates, setViewMoreStates] = useState({}); // Track viewMore for each card
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // Track modal state
  const [selectedService, setSelectedService] = useState(null); // Store selected service

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/sub_category_by_category_id/1`
        );

        if (response?.data?.success === true) {
          setSlides(response?.data?.data || []);
        } else {
          setSlides([]);
        }
      } catch (error) {
        console.error("Error fetching restaurant locations:", error);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBooking = (service) => {
    const token = sessionStorage.getItem("ServiceProviderUserToken");
    if (!token) {
      setMessage("Please log in to book the service.");
      setShow(true);
      handleShow();
    } else {
      navigate("/booking", { state: { service } });
    }
  };

  const handleViewDetails = (service) => {
    setSelectedService(service); // Set selected service
    setModalOpen(true); // Open the modal
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) {
      return { truncated: text, isTruncated: false };
    }
    return {
      truncated: words.slice(0, wordLimit).join(" ") + "...",
      isTruncated: true,
    };
  };

  const toggleViewMore = (index) => {
    setViewMoreStates((prevStates) => ({
      ...prevStates,
      [index]: !prevStates[index], // Toggle the viewMore state for the specific card
    }));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="container-bg-color">
        <div className="nav-container container cook-services pt-4">
          <div>
            {/* <h2 className="section-title">Cook Services</h2> */}
            <div className="service-cards-wrapper pt-4 pb-4">
              {slides.map((service, index) => (
                <div key={index} className="service-card">
                  
                  <div className="card-content p-0">
                  <img
                    src={service?.image}
                    alt={service?.sub_category_name}
                    className="card-image"
                  />
                    <h3>{service?.sub_category_name}</h3>
                    <div className="rating-cook">
                      <span className="stars">
                        {"★"}{" "}
                        <span style={{ color: "#666666" }}>
                          {service?.rating?.toFixed(1) || "0.0"}
                        </span>
                      </span>

                      {/* <span className="reviews">
                        ({service?.reviews}273 reviews)
                      </span> */}
                    </div>

                    {service?.description && (
                      <div className="reviews">
                        <span>
                          {" "}
                          {viewMoreStates[index]
                            ? service.description
                            : truncateText(service.description, 30).truncated}
                        </span>
                        {truncateText(service.description, 30).isTruncated && (
                          <a
                            className="view-more-button"
                            onClick={() => toggleViewMore(index)}
                          >
                            {viewMoreStates[index] ? "View Less" : "View More"}
                          </a>
                        )}
                      </div>
                    )}

                    {/* Checklist Section */}
                    <ul className="checklist">
                      {service?.bullet_points?.map((item, idx) => (
                        <li key={idx}>
                          <div className="circle-icon">
                            <span className="check-icon">✔</span>
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="">
                      <a
                        className="view-more-button"
                        onClick={() => handleViewDetails(service)} // Open the modal with service details
                      >
                        View Details
                      </a>
                    </div>
                    <div className="price-section mt-2 mb-0">
                      {/* <div className="price">
                        Starting from
                        <div className="amount">
                          <span className="currency">₹</span>
                          <span className="value">{service?.price}</span>
                          <span className="period">
                            /{service?.number_of_people}
                          </span>
                        </div>
                      </div> */}
                     
                    </div>
                  </div>
                  <div className="book-now-container">
                        <button
                          className="book-now"
                          onClick={() => handleBooking(service)}
                        >
                          <span className="book-icon">▶</span> Book Now
                        </button>
                      </div>
                </div>
              ))}
              <MessageModal
                show={show}
                handleClose={handleClose}
                handleShow={handleShow}
                message={message}
              />
              <BookingMessageModal
                show={show}
                handleClose={handleClose}
                handleShow={handleShow}
                message={message}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Service Details Modal */}
      <ServiceDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service={selectedService} // Pass the selected service data to the modal
      />
    </>
  );
};

export default CookServiceCards;
