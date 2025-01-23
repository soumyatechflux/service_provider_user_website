import React, { useState } from "react";
import { Star } from "lucide-react";
import "./ReviewModal.css";
import axios from "axios";

const ReviewModal = ({ isOpen, onClose, partnerId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !review) {
      setError("Please provide both a rating and a review.");
      return;
    }

    try {
      setError(null); // Clear any previous errors
      setSuccessMessage(""); // Clear any previous success messages
      setIsSubmitting(true); // Disable the submit button while submitting

      const token = sessionStorage.getItem("ServiceProviderUserToken");

      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/rating/add`,
        {
          partner_id: partnerId,
          rating,
          review,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 && response.data.success) {
        setSuccessMessage("Your review has been submitted successfully!");
        setRating(0);
        setReview("");
        setIsSubmitted(true); // Mark as submitted
      } else {
        setError("Failed to submit your review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("An error occurred while submitting your review.");
    } finally {
      setIsSubmitting(false); // Re-enable the submit button
    }
  };

  return (
    <div
      className={`review-modal-overlay ${isOpen ? "open" : ""}`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        <div className="review-modal-header">
          <h2>Rate Your Experience</h2>
          <button onClick={onClose} className="review-modal-close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="review-form-rating">
            <label>Rating</label>
            <div className="review-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="review-star-button"
                  disabled={isSubmitted} // Disable buttons after successful submission
                >
                  <Star
                    fill={star <= rating ? "#ffc107" : "none"}
                    stroke={star <= rating ? "#ffc107" : "#ccc"}
                    className="review-star"
                    size={24}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="review-form-input">
            <label htmlFor="review">Your Review</label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience..."
              rows="4"
              disabled={isSubmitted} // Disable textarea after successful submission
            />
          </div>

          {error && <div className="review-error">{error}</div>}
          {successMessage && <div className="review-success">{successMessage}</div>}

          <div className="review-modal-actions">
            
            <button
              type="submit"
              className="review-modal-submit"
              disabled={isSubmitting || isSubmitted} // Disable submit button during submission or after success
            >
              {isSubmitted ? "Submitted" : isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
