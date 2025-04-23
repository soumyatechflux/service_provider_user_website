
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import './DriverFeedback.css';

// Demo testimonial data
const testimonials = [
  {
    id: 1,
    text: "Amazing  service! I always had a car sitting idle in my garage as I never gained confidence for driving myself - I love being able to book a driver for my own car. I love how they come to my doorstep and drive around wherever I want to go! Saves me the hassle and cost of cabs or public transport and I can enjoy the comfort of my own car",
    author: " Aashna Mahajan",
    rating: 4
  },
  {
    id: 2,
    text: "I appreciate how easy it is to book a driver on short notice. The app is user-friendly, and I’ve always had great experiences with the drivers. It just makes it simpler getting a safe ride back from late night parties after I have had a few drinks especially.",
    author: " Karan Bawa",
    rating: 5
  },
  {
    id: 3,
    text: "I hate driving in Delhi traffic and finding parking in Delhi is such a hassle now. I booked a driver for a day from Servyo. Having a driver to drive me around, I could do my shopping care free, meet my friends and enjoy the day without being tired from all the delhi road drama.",
    author: " Shriya Kapoor",
    rating: 4
  },
  {
    id: 4,
    text: "The drivers are punctual, friendly, and professional! It’s great knowing I can rely on this app for safe transportation when I need it.",
    author: " Apoorv Narang",
    rating: 4
  },
  
];

const DriverFeedback = () => {
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

export default DriverFeedback