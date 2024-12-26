// import React from 'react'

// const GardenerFeedback = () => {
//   return (
//     <div>GardenerFeedback</div>
//   )
// }

// export default GardenerFeedback



import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import './GardenerFeedback.css';

// Demo testimonial data
const testimonials = [
  {
    id: 1,
    text: "Super tasty food, just like homemade! Booking a cook was so easy, and the food tasted like home. The cook was polite, on time, and even left the kitchen spotless. Perfect solution for busy days!",
    author: "Kiran Malhotra",
    rating: 4
  },
  {
    id: 2,
    text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
    author: "Sarah Johnson",
    rating: 5
  },
  {
    id: 3,
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
    author: "Michael Chen",
    rating: 4
  }
];


const GardenerFeedback = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullText, setShowFullText] = useState(false);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    setShowFullText(false); // Reset text view when switching testimonials
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
    setShowFullText(false); // Reset text view when switching testimonials
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`star ${index < rating ? 'filled' : ''}`}
        size={24}
        fill={index < rating ? "#ffd700" : "none"} // Fully filled for 'filled' class
        stroke={index < rating ? "none" : "#e0e0e0"} // Stroke for unfilled stars
      />
    ));
  };

  const currentTestimonial = testimonials[currentIndex];
  const words = currentTestimonial.text.split(' '); // Split text into words
  const isTextLong = words.length > 20; // Check if word count exceeds 20

  return (
    <div className="testimonial-container pages-margin">
      <div className="justify-content-center">
        <div className="container nav-container">
          <div className="testimonial-header">
            <h2>See What Our Clients Say</h2>
            <div className="navigation-buttons">
              <button
                className="nav-button testimonial-btn"
                onClick={handlePrevious}
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="nav-button testimonial-btn"
                onClick={handleNext}
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="testimonial-content">
            <div className="quote-mark">
              <img src="/Testimonials/Quote.jpg" alt="Quote Mark" />
            </div>
            <div className="rating rating-flex">
              {renderStars(currentTestimonial.rating)}
            </div>
            <div>
              <p className="testimonial-text">
                {isTextLong && !showFullText
                  ? `${words.slice(0, 20).join(" ")}...` 
                  : currentTestimonial.text}
                  {isTextLong && (
                <button
                  className="toggle-text-btn ml-4"
                  onClick={() => setShowFullText((prev) => !prev)}
                >
                  {showFullText ? "View Less" : "View More"}
                </button>
              )}
              
              </p>
              
            </div>

            <p className="author-name">{currentTestimonial.author}</p>
          </div>
        </div>
      </div>
    </div>
  );
  }

export default GardenerFeedback