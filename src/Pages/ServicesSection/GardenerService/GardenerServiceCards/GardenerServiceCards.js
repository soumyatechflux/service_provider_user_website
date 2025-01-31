import React, { useEffect, useState } from "react";
import "./GardenerServiceCards.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../../Loader/Loader";
import MessageModal from "../../../MessageModal/MessageModal";
import ServiceDetailsModal from "../../ServiceDetailsModal/ServiceDetailsModal";
import BookingMessageModal from "../../BookingSection/BookingMessageModal/BookingMessageModal";

const GardenerServiceCards = () => {
  const navigate = useNavigate();

  const token = sessionStorage.getItem("ServiceProviderUserToken");
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState([]);
  const [viewMore, setViewMore] = useState({}); // State to toggle description per card
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // Track modal state
  const [selectedService, setSelectedService] = useState(null); // Store selected service

  const handleClose = () => setShow(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/sub_category_by_category_id/3`
        );

        if (response?.data?.success) {
          setSlides(response?.data?.data || []);
        } else {
          setSlides([]);
        }
      } catch (error) {
        console.error("Error fetching gardener services:", error);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBooking = (service) => {
    if (!token) {
      setMessage("Please log in to book the service.");
      setShow(true);
    } else {
      navigate("/booking", { state: { service } });
    }
  };

  const handleViewDetails = (service) => {
    setSelectedService(service); // Set selected service
    setModalOpen(true); // Open the modal
  };

  // Helper function to truncate text
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
    setViewMore((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="container-bg-color">
        <div className="nav-container container gardener-services pt-4 pb-5">
          <div className="container">
            {/* <h2 className="section-title">Gardener Services</h2> */}
            <div className="service-cards-wrapper-gardener pt-4 pb-4">
              {slides.map((service, index) => (
                <div key={index} className="service-card">
                  <img
                    src={service?.image}
                    alt={service?.sub_category_name}
                    className="card-image"
                  />
                  <div className="card-content p-0">
                    <h3>{service?.sub_category_name}</h3>
                    <div className="rating">
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
                          {viewMore[index]
                            ? service.description
                            : truncateText(service.description, 30).truncated}
                        </span>
                        {truncateText(service.description, 30).isTruncated && (
                          <a
                            className="view-more-button"
                            onClick={() => toggleViewMore(index)}
                          >
                            {viewMore[index] ? "View Less" : "View More"}
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

                    <div className="mt-3">
                      <a
                        className="view-more-button"
                        onClick={() => handleViewDetails(service)}
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
                      <div>
                        <button
                          className="book-now"
                          onClick={() => handleBooking(service)}
                        >
                          <span className="book-icon">▶</span> Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <MessageModal
                show={show}
                handleClose={handleClose}
                message={message}
              />
              <BookingMessageModal
                show={show}
                handleClose={handleClose}
                // handleShow={handleShow}
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

export default GardenerServiceCards;

{
  /* <ul className="features">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>
                        <span className="check-icon">&#10003;</span>
                        {feature}
                      </li>
                    ))}
                  </ul> */
}

{
  /* <a href="#" className="view-details">
                    View Details
                  </a> */
}
