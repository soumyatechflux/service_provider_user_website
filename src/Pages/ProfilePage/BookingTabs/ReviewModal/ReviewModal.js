import React, { useState } from "react";
import { Star } from "lucide-react";
import "./ReviewModal.css";

const ReviewModal = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // onSubmit({ rating, review });
    setRating(0);
    setReview("");
    onClose();
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
                >
                  <Star
                    fill={star <= rating ? "#ffc107" : "none"} // Fill the star if it's selected
                    stroke={star <= rating ? "#ffc107" : "#ccc"} // Adjust stroke to match filled color
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

          <div className="review-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="review-modal-cancel"
            >
              Cancel
            </button>
            <button type="submit" className="review-modal-submit">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
