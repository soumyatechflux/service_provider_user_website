
// import { useState } from 'react';
// import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
// import './CookFeedback.css';

// // Demo testimonial data
// const testimonials = [
//   {
//     id: 1,
//     text: "We booked a cook for the whole day for our family. Breakfast, lunch, and dinner were all made fresh, and the taste was just like home. The cook was on time, organized, and I didn’t have to worry about anything. Very convenient and I recommend this service!",
//     author: "Yash",
//     rating: 4
//   },
//   {
//     id: 2,
//     text: "The food tastes like home, and I love how it’s customized to our family’s preferences. Makes cooking so much easier!",
//     author: "Rhythm Sachdeva",
//     rating: 5
//   },
//   {
//     id: 3,
//     text: "We hired a cook for a get together, and the food was superhit! The cook handled everything smoothly from appetizers to main course, and I could actually relax and enjoy with my guests. Highly recommended for any dinner party or social gathering!",
//     author: " Ruchi Bansal",
//     rating: 4
//   },
//   {
//     id: 4,
//     text: "I used to order in or eat out when I didn’t feel like cooking, but having a cook at home has changed that. The meals are cooked fresh, healthier, and customized to my taste",
//     author: " Hanisha",
//     rating: 4
//   },
//   {
//     id: 5,
//     text: "Super tasty food, just like homemade! Booking a cook was so easy,and the food tasted like home. The cook was olite, on time, and even left the kitchen spotless. Perfect solution for busy days!",
//     author: " Sakshi Gupta",
//     rating: 4
//   },
//   {
//     id: 6,
//     text: "I signed up for the monthly gardener service, and it’s been amazing! Each month, they handle everything from pruning to seasonal planting. I love that it’s all taken care of, and my garden looks healthier than ever!",
//     author: "Shivangi",
//     rating: 4
//   },
// ];


// const CookFeedback = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [showFullText, setShowFullText] = useState(false);

//   const handlePrevious = () => {
//     setCurrentIndex((prevIndex) => 
//       prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
//     );
//     setShowFullText(false); // Reset text view when switching testimonials
//   };

//   const handleNext = () => {
//     setCurrentIndex((prevIndex) => 
//       prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
//     );
//     setShowFullText(false); // Reset text view when switching testimonials
//   };

//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }, (_, index) => (
//       <Star
//         key={index}
//         className={`star ${index < rating ? 'filled' : ''}`}
//         size={24}
//         fill={index < rating ? "#ffd700" : "none"} // Fully filled for 'filled' class
//         stroke={index < rating ? "none" : "#e0e0e0"} // Stroke for unfilled stars
//       />
//     ));
//   };

//   const currentTestimonial = testimonials[currentIndex];
//   const words = currentTestimonial.text.split(' '); // Split text into words
//   const isTextLong = words.length > 20; // Check if word count exceeds 20

//   return (
//     <div className="testimonial-container pages-margin">
//       <div className="justify-content-center">
//         <div className="container nav-container">
//           <div className="testimonial-header">
//             <h2>See What Our Clients Say</h2>
//             <div className="navigation-buttons">
//               <button
//                 className="nav-button testimonial-btn"
//                 onClick={handlePrevious}
//                 aria-label="Previous testimonial"
//               >
//                 <ChevronLeft size={24} />
//               </button>
//               <button
//                 className="nav-button testimonial-btn"
//                 onClick={handleNext}
//                 aria-label="Next testimonial"
//               >
//                 <ChevronRight size={24} />
//               </button>
//             </div>
//           </div>

//           <div className="testimonial-content">
//             <div className="quote-mark">
//               <img src="/Testimonials/Quote.jpg" alt="Quote Mark" />
//             </div>
//             <div className="rating rating-flex">
//               {renderStars(currentTestimonial.rating)}
//             </div>
//             <div>
//               <p className="testimonial-text">
//                 {isTextLong && !showFullText
//                   ? `${words.slice(0, 20).join(" ")}...` 
//                   : currentTestimonial.text}
//                   {isTextLong && (
//                 <button
//                   className="toggle-text-btn ml-4"
//                   onClick={() => setShowFullText((prev) => !prev)}
//                 >
//                   {showFullText ? "View Less" : "View More"}
//                 </button>
//               )}
              
//               </p>
              
//             </div>

//             <p className="author-name">{currentTestimonial.author}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
//   }

// export default CookFeedback


import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import './CookFeedback.css';

const CookFeedback = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullText, setShowFullText] = useState(false);

  const baseURL = process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL;

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/customer/testimonials`);
        if (response.data?.success && response.data?.data) {
          setTestimonials(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      }
    };

    fetchTestimonials();
  }, [baseURL]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    setShowFullText(false);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
    setShowFullText(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`star ${index < rating ? 'filled' : ''}`}
        size={24}
        fill={index < rating ? "#ffd700" : "none"}
        stroke={index < rating ? "none" : "#e0e0e0"}
      />
    ));
  };

  if (testimonials.length === 0) {
    return <div className="testimonial-container pages-margin">Loading testimonials...</div>;
  }

  const currentTestimonial = testimonials[currentIndex];
  const words = currentTestimonial.comment.split(' ');
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
              <img src="/Testimonials/Quote.jpg" alt="Quote Mark" />
            </div>
            <div className="rating rating-flex">
              {renderStars(currentTestimonial.rating)}
            </div>
            <div>
              <p className="testimonial-text">
                {isTextLong && !showFullText
                  ? `${words.slice(0, 20).join(" ")}...`
                  : currentTestimonial.comment}
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

            <p className="author-name">{currentTestimonial.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookFeedback;
