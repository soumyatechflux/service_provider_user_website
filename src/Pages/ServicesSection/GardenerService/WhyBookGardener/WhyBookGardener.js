// import React from 'react'

// const WhyBookGardener = () => {
//   return (
//     <div>WhyBookGardener</div>
//   )
// }

// export default WhyBookGardener




// import React from 'react'
// import { Check } from 'lucide-react';
// import "./WhyBookGardener.css"

// const WhyBookGardener = () => {
//     return (
//         <div className="why-book-section">
//           <div className="nav-container container">
//             <h2 className="section-title">Why Book Gardener From Us</h2>
            
//             <div className="features-container">
//               <div className="central-image-container">
//                 <img 
//                   src="./../ServicesSection/GardenerServices/Frame3.jpg"
//                   alt="Professional Chef"
//                   className="central-image"
//                 />
                
//                 {/* Feature Boxes */}
//                 <div className="feature-box top-left">
//                   <Check className="check-icon-whyBook"  />
//                   <span className='why-book-text'>Professional and vetted gardeners</span>
//                 </div>
    
//                 <div className="feature-box top-right">
//                   <Check className="check-icon-whyBook" size={24} />
                  

//                   <span className='why-book-text'>Tailored to your garden</span>
                  
//                 </div>
    
//                 <div className="feature-box middle-left">
//                   <Check className="check-icon-whyBook" size={24} />
//                   <span className='why-book-text'>Flexible monthly packages</span>
//                 </div>
    
//                 <div className="feature-box bottom-right">
//                   <Check className="check-icon-whyBook" size={24} />
//                   <span className='why-book-text'>Wide range of maintenance services</span>
//                 </div>
    
//                 {/* Decorative Elements */}
//                 {/* <div className=""><img src='./../ServicesSection/ClipPathGroup.jpg' /></div> */}
//               </div>
//             </div>
//           </div>
//         </div>
//       );
// }

// export default WhyBookGardener

import React, { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react';
import "./WhyBookGardener.css"

const WhyBookGardener = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);  // Trigger animation when section is in view
                } else {
                    setIsVisible(false); // Reset animation when section is out of view
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current); // Clean up when component unmounts
            }
        };
    }, []);

    const features = [
        { id: 'top-left', text: 'Professional and vetted gardeners' },
        { id: 'top-right', text: 'Tailored to your garden' },
        { id: 'middle-left', text: 'Flexible monthly packages' },
        { id: 'bottom-right', text: 'Wide range of maintenance services' },
    ];

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
            <h2 className="section-title">Why Book Gardener From Us</h2>
            
            <div className="features-container">
              <div className="central-image-container">
                <img 
                  src="/ServicesSection/GardenerServices/Frame3.jpg"
                  alt="Professional Gardener"
                  className="central-image"
                />
                
                {features.map((feature) => (
                  <div 
                    key={feature.id}
                    className={`feature-box ${feature.id} ${activeFeature === feature.id ? 'active' : ''}`}
                    onMouseEnter={() => setActiveFeature(feature.id)}
                    onMouseLeave={() => setActiveFeature(null)}
                  >
                    <Check className="check-icon-whyBook" size={24} />
                    <span className='why-book-text'>{feature.text}</span>
                  </div>
                ))}

                <div className={`highlight-circle ${activeFeature ? 'active' : ''}`} />
              </div>
            </div>
          </div>
        </div>
    );
}

export default WhyBookGardener;
