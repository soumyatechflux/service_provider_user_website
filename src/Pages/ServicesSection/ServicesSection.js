import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ServicesSection.css";
import axios from "axios";

const ServicesSection = () => {
  const [allServices, setAllServices] = useState([]);
const getAllServices = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/category`,
      );
      if (response && response.data) {
        setAllServices(response.data.data || []);
      } else {
        console.error("Unexpected response structure:", response);
        setAllServices([]); // Set to empty array to prevent rendering issues
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
  };
}

  useEffect(() => {
    getAllServices();
  }, []);
  return (
    <div className="container-bg-color">
      <div className="container nav-container pages-margin">
        <h2 className="text-center mb-4 services-title">Services</h2>
        <div className="row services-div">
          {allServices.map((service, index) => (
            <div key={index} className="col-md-4 mb-2">
              <div className="card h-100 text-center">
                <Link to={`/services/${service.id}`} className="text-decoration-none card-color">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="card-img-top mx-auto mt-3"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{service.category_name}</h5>
                    <p className="card-text">{service.description}</p>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;

















