// import React from 'react'
// import { Check } from 'lucide-react';
// import "./WhyBookCooks.css"

// const WhyBookCooks = () => {
//     return (
//         <div className="why-book-section">
//           <div className="nav-container container">
//             <h2 className="section-title">Why Book Cooks From Us</h2>
            
//             <div className="features-container">
//               <div className="central-image-container">
//                 <img 
//                   src="./../ServicesSection/Frame.jpg?height=640&width=440" 
//                   alt="Professional Chef"
//                   className="central-image"
//                 />
                
//                 {/* Feature Boxes */}
//                 <div className="feature-box top-left">
//                   <Check className="check-icon-whyBook"  />
//                   <span className='why-book-text'>Professional and trained cooks</span>
//                 </div>
    
//                 <div className="feature-box top-right">
//                   <Check className="check-icon-whyBook" size={24} />
                  

//                   <span className='why-book-text'>Safety and hygiene</span>
                  
//                 </div>
    
//                 <div className="feature-box middle-left">
//                   <Check className="check-icon-whyBook" size={24} />
//                   <span className='why-book-text'>Food customized to your taste</span>
//                 </div>
    
//                 <div className="feature-box bottom-right">
//                   <Check className="check-icon-whyBook" size={24} />
//                   <span className='why-book-text'>Multi cuisine</span>
//                 </div>
    
//                 {/* Decorative Elements */}
//                 {/* <div className=""><img src='./../ServicesSection/ClipPathGroup.jpg' /></div> */}
//               </div>
//             </div>
//           </div>
//         </div>
//       );
// }

// export default WhyBookCooks

//fade in animation

import React, { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react';
import "./WhyBookCooks.css"

const WhyBookCooks = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
      <div className={`why-book-section ${isVisible ? 'animate' : ''}`} ref={sectionRef}>
          <div className="dotted-line-container">
              <img
                  src="/ServicesSection/ClipPathGroup.jpg" 
                  alt="Decorative dotted line"
                  className="dotted-line-image"
              />
          </div>
          <div className="nav-container container">
              <h2 className="section-title">Why Book Cooks From Us</h2>
              <div className="features-container">
                  <div className="central-image-container">
                      <img
                          src="/ServicesSection/Frame.jpg"
                          alt="Professional Chef"
                          className="central-image"
                      />
                      <div className="feature-box top-left">
                          <Check className="check-icon-whyBook" size={24} />
                          <span className='why-book-text'>Professional and trained cooks</span>
                      </div>
                      <div className="feature-box top-right">
                          <Check className="check-icon-whyBook" size={24} />
                          <span className='why-book-text'>Safety and hygiene</span>
                      </div>
                      <div className="feature-box middle-left">
                          <Check className="check-icon-whyBook" size={24} />
                          <span className='why-book-text'>Food customized to your taste</span>
                      </div>
                      <div className="feature-box bottom-right">
                          <Check className="check-icon-whyBook" size={24} />
                          <span className='why-book-text'>Multi cuisine</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
  
}

export default WhyBookCooks





// other animation

// import React, { useEffect, useRef, useState } from 'react'
// import { Check } from 'lucide-react';
// import "./WhyBookCooks.css"

// const WhyBookCooks = () => {
//     const [isVisible, setIsVisible] = useState(false);
//     const [activeFeature, setActiveFeature] = useState(null);
//     const sectionRef = useRef(null);

//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             ([entry]) => {
//                 if (entry.isIntersecting) {
//                     setIsVisible(true); // Add class to trigger animation when in view
//                 } else {
//                     setIsVisible(false); // Reset animation when out of view
//                 }
//             },
//             { threshold: 0.1 }
//         );

//         if (sectionRef.current) {
//             observer.observe(sectionRef.current);
//         }

//         return () => {
//             if (sectionRef.current) {
//                 observer.unobserve(sectionRef.current);
//             }
//         };
//     }, []);

//     const features = [
//         { id: 'top-left', text: 'Professional and trained cooks' },
//         { id: 'top-right', text: 'Safety and hygiene' },
//         { id: 'middle-left', text: 'Food customized to your taste' },
//         { id: 'bottom-right', text: 'Multi cuisine' },
//     ];

//     return (
//         <div className={`why-book-section ${isVisible ? 'animate' : ''}`} ref={sectionRef}>
//           <div className="nav-container container">
//             <h2 className="section-title">Why Book Cooks From Us</h2>
            
//             <div className="features-container">
//               <div className="central-image-container">
//                 <img 
//                   src="/ServicesSection/Frame.jpg"
//                   alt="Professional Chef"
//                   className="central-image"
//                 />
                
//                 {features.map((feature) => (
//                   <div 
//                     key={feature.id}
//                     className={`feature-box ${feature.id} ${activeFeature === feature.id ? 'active' : ''}`}
//                     onMouseEnter={() => setActiveFeature(feature.id)}
//                     onMouseLeave={() => setActiveFeature(null)}
//                   >
//                     <Check className="check-icon-whyBook" size={24} />
//                     <span className='why-book-text'>{feature.text}</span>
//                   </div>
//                 ))}

//                 {/* <div className={`highlight-circle ${activeFeature ? 'active' : ''}`} /> */}
//               </div>
//             </div>
//           </div>
//         </div>
//     );
// }

// export default WhyBookCooks
