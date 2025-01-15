import React from "react";
import { Star } from "lucide-react";
import "./ServiceDetailsModal.css";
import { useEffect } from "react";

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
  // Default data if the service data is missing
  const reviews = service?.reviews || [
    {
      author: "Anonymous",
      date: "Unknown",
      rating: 3,
      tag: "No reviews yet",
      content: "No reviews available.",
    },
  ];

  const ratingDistribution = service?.ratingDistribution || [
    { stars: 5, percentage: 0 },
    { stars: 4, percentage: 0 },
    { stars: 3, percentage: 0 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 },
  ];

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
          <div className="modal-header">
            <h5 className="modal-title" id="serviceDetailsModalLabel">
              {service?.sub_category_name || "Service Title"}
            </h5>
            <div className="d-flex align-items-center gap-2">
              <div className="rating-modal">
                <Star className="star-icon" size={16} fill="currentColor" />
                <span>{service?.rating || "N/A"} ({service?.reviews || 0} reviews)</span>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
          </div>

          <div className="modal-body">
            {/* Price Section */}
            <div className="price-section">
              <p className="text-muted mb-1">Starting from</p>
              <h3 className="price-service">
                ₹{service?.price || "N/A"}
                <span className="visit">/visit</span>
              </h3>
            </div>

            {/* Features Section */}
            <div className="features-section">
              <div className="feature-item">
                <div className="feature-icon">⏱️</div>
                <div className="feature-content">
                  <h5 className="feature-subtitles">Service Duration</h5>
                  <p>{service?.duration || "N/A"}</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🏆</div>
                <div className="feature-content">
                  <h5>Quality</h5>
                  <p>{service?.quality || "N/A"}</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📋</div>
                <div className="feature-content">
                  <h5>Additional Info</h5>
                  <p>{service?.additional_info || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Process Section */}
            <div className="process-section">
              <h6 className="modal-subtitles">Process</h6>
              <p>{service?.process || "N/A"}</p>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <h6 className="modal-subtitles">Reviews</h6>

              <div className="rating-distribution">
                <div className="rating-bars">
                  {ratingDistribution.map((item, index) => (
                    <div key={index} className="rating-bar-item">
                      <span className="stars" style={{ color: "black" }}>
                        {item.stars}
                      </span>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="overall-rating">
                  <div className="rating-service-modal">
                    <h2>{service?.rating || "N/A"}</h2>
                    <Star className="star-icon" size={20} fill="currentColor" />
                  </div>

                  <p>{service?.reviews || 0} Reviews</p>
                </div>
              </div>

              <div className="reviews-list">
                {reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="avatar-service-modal">
                          {review.author[0]}
                        </div>
                        <div>
                          <h6>{review.author}</h6>
                          <p className="date">{review.date}</p>
                        </div>
                      </div>
                      <div className="review-rating">
                        {[1, 2, 3].map((star) => (
                          <Star
                            key={star}
                            className="star-icon"
                            size={16}
                            fill="currentColor"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="review-tag">{review.tag}</div>
                    <p className="review-content">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ServiceDetailsModal;
