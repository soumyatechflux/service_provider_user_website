import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import "./ReviewModal.css";
import axios from "axios";

const ReviewModal = ({ isOpen, onClose, partnerId,categoryId,bookingId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch existing review when modal opens
  useEffect(() => {
    const fetchExistingReview = async () => {
      if (isOpen && !isSubmitted) {
        console.log("Fetching review for partnerId:", partnerId);
        try {
          const token = sessionStorage.getItem("ServiceProviderUserToken");

          const response = await axios.get(
            `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/rating/${partnerId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.status === 200 && response.data.success) {
            const { rating, review } = response.data.data; // Extract data from the response
            setRating(parseFloat(rating)); // Convert rating to float if needed
            setReview(review);
            setIsSubmitted(true); // Mark as reviewed
          }
        } catch (error) {
          console.error("Error fetching review:", error);
        }
      }
    };

    fetchExistingReview();
  }, [isOpen, partnerId, isSubmitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      setError("Please provide rating.");
      return;
    }

    try {
      setError(null);
      setSuccessMessage("");
      setIsSubmitting(true);

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
        setIsSubmitted(true); // Mark as submitted
        // No longer closing the modal, leaving it open after submission
      } else {
        setError("Failed to submit your review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("An error occurred while submitting your review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("Booking ID:", bookingId);

    if (!rating) {
      setError("Please provide rating.");
      return;
    }

    try {
      setError(null);
      setSuccessMessage("");
      setIsSubmitting(true);

      const token = sessionStorage.getItem("ServiceProviderUserToken");

      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/rating/add`,
        {
          partner_id: partnerId,
          category_id: categoryId,
          booking_id: bookingId, 
          rating,
          review,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 && response.data.success) {
        setSuccessMessage("Your review has been updated successfully!");
        setIsSubmitted(true); // Mark as updated
        // No longer closing the modal, leaving it open after updating
      } else {
        setError("Failed to update your review. Please try again.");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      setError("An error occurred while updating your review.");
    } finally {
      setIsSubmitting(false);
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

        <form onSubmit={isSubmitted ? handleUpdate : handleSubmit} className="review-form">
          <div className="review-form-rating">
            <label>Rating</label>
            <div className="review-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="review-star-button"
                  disabled={isSubmitting} // Disable rating selection while submitting
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
            />
          </div>

          {error && <div className="review-error">{error}</div>}
          {successMessage && <div className="review-success">{successMessage}</div>}

          <div className="review-modal-actions">
            <button
              type="submit"
              className="review-modal-submit"
              disabled={isSubmitting} // Disable submit button while submitting
            >
              {isSubmitted ? "Update Review" : isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
