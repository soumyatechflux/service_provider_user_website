import React, { useEffect } from "react";
import "./ServiceDetailsModal.css";

function ServiceDetailsModal({ isOpen, onClose, service }) {
  useEffect(() => {
    // Add or remove the 'no-scroll' class based on the modal state
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Clean up when the component unmounts
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  // Static data for bullet points based on service.id
  const serviceData = {
    1: [
      "Fill in the required details, select date and time. Our professional cook will arrive to your location on time.",
    "Cook for one meal can be booked for up to 15 people. For more than 15 people, please book chef for party.",
    "Our cooks ensure all meals are prepared with proper hygiene and safety.",
    "The cook will wipe the stove and countertops used during meal preparation and leave your kitchen as it was earlier.",
    "We provide an extensive menu of dishes to choose from. All required ingredients and kitchen appliances to be provided by the customer.",
    "Utensil cleaning is not provided as part of this service.",
    "Cancel for free anytime up to 2 hours before service starts.",
    "No religion, caste, or gender preferences."
    ],
    2: [
      "Fill in the required details, select date and arrival time. Our professional cook will arrive at your location on time.",
    "Cook for a day can be booked for up to 15 people. For more than 15 people, please book chef for party or you can make two bookings for ‘Cook for a day’.",
    "Our cooks ensure all meals are prepared with proper hygiene and safety.",
    "The cook will wipe the stove and countertops used during meal preparation and leave your kitchen as it was earlier.",
    "We provide an extensive menu of dishes to choose from. All required ingredients and kitchen appliances to be provided by the customer.",
    "Utensil cleaning is not provided as part of this service.",
    "Cancel for free anytime up to 24 hours before service starts.",
    "No religion, caste, or gender preferences.",
    ],
    // Repeat for IDs 3 to 9
    3: [
      "Fill in the required details, select date and party time. Our professional cook will arrive to your location 3 - 4 hours prior to party start time.",
    "An assistant may accompany the party chef, if needed, to ensure everything runs smoothly.",
    "Our chefs can take care of all meals including starters, main course, desserts, raita, salads, soups, breads & rice. Please select your requirements while booking.",
    "Our cooks ensure all meals are prepared with proper hygiene and safety.",
    "The cook will wipe the stove and countertops used during meal preparation and leave your kitchen as it was earlier.",
    "We provide an extensive menu of dishes to choose from. All required ingredients and kitchen appliances to be provided by the customer.",
    "Utensil cleaning is not provided as part of this service.",
    "Cancel for free anytime up to 24 hours before service starts.",
    "No religion, caste, or gender preferences.",
    ],
    4: [
      "Fill in your pick-up location, car details, date and time. Our professional driver will arrive to your location on time.",
    "Drop location must not be more than 2 kms away from pickup location.",
    "Complementary cleaning of seat, steering wheel, and gear after the trip ends.",
    "Vehicle damage protection plan provided (please select before checkout).",
    "Cancel for free anytime up to 2 hours before the trip starts.",
    "No religion, caste, or gender preferences.",
    ],
    5: [
      "Fill in your pick-up & drop location, car details, date and time. Our professional driver will pick and drop you on time.",
    "Pick up from one location and drop to another location.",
    "Complementary cleaning of seat, steering wheel and gear after the trip ends.",
    "Vehicle damage protection plan provided (please select before checkout).",
    "Cancel for free anytime up to 2 hours before the trip starts.",
    "No religion, caste, or gender preferences.",
    ],
    6: [
      "Fill in your pick-up location, car details, date and pickup time. Our professional driver will arrive on time.",
    "Complementary cleaning of seat, steering wheel and gear after the trip ends.",
    "Vehicle damage protection plan provided (please select before checkout).",
    "Cancel for free anytime up to 12 hours before the trip starts.",
    "No religion, caste, or gender preferences.",
    ],
    7: [
      "Fill in your pick-up location, car and trip details, date and time. Our professional driver will arrive to your location ready to start your trip.",
    "Food and accommodation for the driver to be provided by the customer.",
    "We offer only round trips only i.e. pickup and drop to the same city.",
    "Complementary cleaning of seat, steering wheel and gear after the trip ends.",
    "Vehicle damage protection plan provided (please select before checkout).",
    "Cancel for free anytime up to 24 hours before the trip starts.",
    "No religion, caste, or gender preferences.",
    ],
    8: [
      "Select your preferred date and time. Our professional will arrive to your location with the required tools and expertise.",
    "Cancel for free anytime up to 2 hours before the service starts.",
    "Charges are calculated on an hourly basis.",
    "Our service takes care of end-to-end garden maintenance, including watering, garden cleaning, weed control, fertilising, repotting, planting, pruning, trimming, topiary, and lawn grass mowing.",
    "Our gardeners can also provide any other services on demand. Additional charges may apply for any products required for services outside of the above scope.",
    "No religion, caste, or gender preferences.",
    ],
    9: [
      "Select your preferred monthly plan with number of visits and hours per visit. Our professional gardener will arrive to your location with the required tools and expertise as per your selection.",
    "Cancel for free any time before a new month starts.",
    "Easy gardener replacement available if you are not satisfied with the service.",
    "Each visit takes care of end-to-end garden maintenance, including watering, garden cleaning, weed control, fertilising, repotting, planting, pruning, trimming, topiary, and lawn grass mowing.",
    "No religion, caste, or gender preferences.",
    ],
    // Add remaining IDs up to 9
  };

  // Extract the static points based on the service.id
  const staticPoints = serviceData[service?.id] || ["No details available."];

  return (
    <div
      className={`modal fade ${isOpen ? "show" : ""}`}
      id="serviceDetailsModal"
      tabIndex="-1"
      aria-labelledby="serviceDetailsModalLabel"
      aria-hidden={!isOpen}
      style={{ display: isOpen ? "block" : "none" }}
      
    >
      <div className="modal-dialog modal-dialog-scrollable service-detail-modal">
        <div className="modal-content">
          <div className="modal-header-service">
            <h5 className="modal-title" id="serviceDetailsModalLabel">
              {service?.sub_category_name || "Service Title"}
            </h5>
            <button
              type="button"
              style={{color:"white"}}
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <h6 className="modal-subtitles">Key Details:</h6>
            <ul>
              {staticPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetailsModal;
