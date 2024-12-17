


import React, { useEffect, useState } from "react";
import "./CookServiceCards.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../../Loader/Loader";
import MessageModal from "../../../MessageModal/MessageModal";

// import cook1 from '../../../../../public/ServicesSection/chef-cooking.jpg'

const CookServiceCards = () => {
  const navigate = useNavigate();

  const token = sessionStorage.getItem("ServiceProviderUserToken");
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState([]);
  const [viewMore, setViewMore] = useState(false); // State to toggle description
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
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
      {/* {loading && <Loader />}ujhj */}
      <div className="container-bg-color">
        <div className="nav-container container cook-services mt-4">
          <div className="">
            <h2 className="section-title">Cook Services</h2>
            <div className="service-cards-wrapper">
              {slides.map((service, index) => {
                

                return (
                  <div key={index} className="service-card">
                    <img
                      src={service?.image}
                      alt={service?.sub_category_name}
                      className="card-image"
                      style={{ height: "200px", width: "300px" }}
                    />
                    <div className="card-content">
                      <h3>{service?.sub_category_name}</h3>
                      <div className="rating-cook">
                        <span className="stars">
                          {"★".repeat(Math.floor(service?.rating))}
                          {"☆".repeat(5 - Math.floor(service?.rating))}
                        </span>
                        <span className="reviews">
                          ({service?.reviews} reviews)
                        </span>
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

                      <div className="price-section mt-2">
                        <div className="price">
                          Starting from
                          <div className="amount">
                            <span className="currency">₹</span>
                            <span className="value">{service?.price}</span>
                            <span className="period">
                              /{service?.number_of_people}
                            </span>
                          </div>
                        </div>
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
                );
              })}
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
    </>
  );

};

export default CookServiceCards;
