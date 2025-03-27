import React from "react";
import "./NewsLetter.css";

const NewsLetter = () => {
  return (
    <div className="container nav-container mt-5 ">
      <div className="newsletter-section">
        <h2 className="newsletter-heading">
          Be in the Loop! Subscribe to Our Newsletter for Exclusive Offers and
          Tips.
        </h2>
        <form className="newsletter-form">
          <input
            type="email"
            placeholder="Email Address"
            className="newsletter-input"
          />
          <button type="submit" className="newsletter-button">
            SUBSCRIBE
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewsLetter;
