import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import './Testimonials.css';

// Demo testimonial data
const testimonials = [
  {
    id: 1,
    text: "Having access to different services in one app only is so much easier. I don't need to download a different app for each service and I love that I can schedule everything from gardening to cooking without any hassle!",
    author: "Neeru Goel",
    rating: 4
  },
  {
    id: 2,
    text: "I appreciate the thorough background checks on service providers. As a mother, it gives me immense peace of mind knowing I can trust the people coming into my home.",
    author: "Anku Bala",
    rating: 5
  },
  {
    id: 3,
    text: "Finally, an app that truly understands the needs of busy moms and working women. I appreciate the wide range of services available, it's easy to use and can manage multiple tasks at one place. I can't wait for them to add more services, I have tried different providers and I have been more than satisfied!",
    author: " Roopali Gupta",
    rating: 4
  },
  {
    id: 4,
    text: "The drivers are punctual, friendly, and professional! It’s great knowing I can rely on this app for safe transportation when I need it.",
    author: " Apoorv Narang",
    rating: 4
  },
  {
    id: 5,
    text: "Super tasty food, just like homemade! Booking a cook was so easy,and the food tasted like home. The cook was olite, on time, and even left the kitchen spotless. Perfect solution for busy days!",
    author: " Sakshi Gupta",
    rating: 4
  },
  {
    id: 6,
    text: "I signed up for the monthly gardener service, and it’s been amazing! Each month, they handle everything from pruning to seasonal planting. I love that it’s all taken care of, and my garden looks healthier than ever!",
    author: "Shivangi",
    rating: 4
  },
];

const Testimonials = () => {
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
        fill={index < rating ? "#f88600" : "none"} // Fully filled for 'filled' class
        stroke={index < rating ? "#f88600" : "#e0e0e0"} // Stroke color for unfilled stars
      />
    ));
  };
  

  const currentTestimonial = testimonials[currentIndex];
  const words = currentTestimonial.text.split(' '); 
  const isTextLong = words.length > 20; 

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
              <img src="./Testimonials/Quote.jpg" alt="Quote Mark" />
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

export default Testimonials;
