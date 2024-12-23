
import React, { useEffect, useState } from "react";
import "./DriverServiceCards.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../../Loader/Loader";
import MessageModal from "../../../MessageModal/MessageModal";
import ServiceDetailsModal from "../../ServiceDetailsModal/ServiceDetailsModal";
// import { Loader } from "lucide-react";


const DriverServiceCards = () => {


  const navigate = useNavigate();
  
  const token = sessionStorage.getItem("ServiceProviderUserToken");
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState([]);
  const [viewMore, setViewMore] = useState(false); // State to toggle description
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
    const [modalOpen, setModalOpen] = useState(false); // Track modal state
    const [selectedService, setSelectedService] = useState(null); // Store selected service


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/sub_category_by_category_id/2`);

        if(response?.data?.success === true){
        setSlides(response?.data?.data || []);
        }else{ setSlides([])}

      setLoading(false);

      } catch (error) {
        console.error("Error fetching restaurant locations:", error);
        setSlides([]);
      setLoading(false);

      }
      finally{
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
        handleShow(); // Show the modal
    } else {
      navigate("/booking", { state: { service } }); // Navigate to booking page with the service details
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

  if(loading){
    return <Loader/>
  }

  return (
    <>
    
    <div className="container-bg-color">
      <div className="nav-container container cook-services mt-4  ">
        <div className="container">
          <h2 className="section-title">Driver Services</h2>
          <div className="service-cards-wrapper">
          {slides.map((service, index) => (
              <div key={index} className="service-card">
                <img
                  src={service?.image}
                  alt={service?.sub_category_name}
                  className="card-image"
                />
                <div className="card-content">
                  <h3>{service?.sub_category_name}</h3>
                  <div className="rating-cook">
                    <span className="stars">
                      {"★".repeat(Math.floor(service?.rating))}
                      {"☆".repeat(5 - Math.floor(service?.rating))}
                    </span>
                    <span className="reviews">({service?.reviews} reviews)</span>


                  </div>


                  {service?.description && (
                        <div className="reviews">
                          <span>
                            Description:{" "}
                            {viewMore
                              ? service.description
                              : truncateText(service.description, 30).truncated}
                          </span>
                          {truncateText(service.description, 30).isTruncated && (
                            <a
                              className="view-more-button"
                              onClick={() => setViewMore(!viewMore)}
                            >
                              {viewMore ? "View Less" : "View More"}
                            </a>
                          )}
                        </div>
                      )}
                      <div className="mt-3">
                      <a
                        className="view-more-button"
                        onClick={() => handleViewDetails(service)} // Open the modal with service details
                      >
                        View Details
                      </a>
                    </div>

                  {/* <ul className="features">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>
                        <span className="check-icon">&#10003;</span>
                        {feature}
                      </li>
                    ))}
                  </ul> */}

                  {/* <a href="#" className="view-details">
                    View Details
                  </a> */}


                  <div className="price-section mt-2">
                    <div className="price">
                      Starting from
                      <div className="amount">
                        <span className="currency">₹</span>
                        <span className="value">{service?.price}</span>
                        <span className="period">/{service?.number_of_people}</span>
                      </div>
                    </div>
                    <div>
                      <button className="book-now" 
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

export default DriverServiceCards;
