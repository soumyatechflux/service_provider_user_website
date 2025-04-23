import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import './GardenerFeedback.css';

// Demo testimonial data
const testimonials = [
  {
    id: 1,
    text: "Our front garden had overgrown patches and needed work, so we booked a gardener from Servyo. He handled everything from mowing to weeding and even reshaped the flower beds. The whole booking process was simple, and our garden has never looked better!",
    author: "Yash Chawla",
    rating: 4
  },
  {
    id: 2,
    text: "Booked a gardener to revive my rooftop garden, and they did an amazing job! They pruned, replanted, and added new herbs just as I wanted. Great service—easy to book, and the space looks so much better!",
    author: "Rishav",
    rating: 5
  },
  {
    id: 3,
    text: "I don’t have the time or energy to maintain my balcony garden, so hiring a gardener was the best decision. I have booked the monthly package with flexibility to choose visit time as per my schedule and they handle everything perfectly.",
    author: " Ruchi Bansal",
    rating: 4
  },
  
 
  {
    id: 4,
    text: "I signed up for the monthly gardener service, and it’s been amazing! Each month, they handle everything from pruning to seasonal planting. I love that it’s all taken care of, and my garden looks healthier than ever!",
    author: "Shivangi",
    rating: 4
  },
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