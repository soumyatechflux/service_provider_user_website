// import React from 'react'
// import "./CookMarketingSection.css"


// const services = [
//     {
//       id: 1,
//       title: "Cook For One Meal",
//       description: "Enjoy the taste of Ghar Ka Khana, anytime you want. Our cooks prepare fresh, comforting meals tailored to your taste, right at home. Have a busy day, hosting a small gathering, or just don't feel like cooking? Skip the meal prep and let us serve up the delicious, homestyle food you crave, whenever you need it!",
//       image: "./../ServicesSection/CookingSection/chef-cooking-4.jpg"
//     },
//     {
//       id: 2,
//       title: "Cook For A Day",
//       description: "From breakfast to dinner, our cook handles the entire cooking process, giving you a break from daily meal prep and letting you savor a variety of fresh, delicious home-cooked meals prepared right in your kitchen. Our cook for a day service is perfect for busy days, family visits, sick days, special occasions, and much more.",
//       image: "./../ServicesSection/CookingSection/chef-cooking-5.jpg"
//     },
//     {
//       id: 3,
//       title: "Chef For Party",
//       description: "Make your next celebration unforgettable with our expert cooks who prepare delicious, multi-cuisine dishes tailored to your event. From appetizers to desserts, we ensure a seamless and stress-free hosting experience, allowing you to enjoy the festivities while we take care of the delicious details!",
//       image: "./../ServicesSection/CookingSection/chef-cooking-6.jpg"
//     }
//   ];

// const CookMarketingSection = () => {
//     return (
//         <div className="services-section">
//           <div className="nav-container container">
//             {services.map((service) => (
//               <div key={service.id} className="service-item">
//                 <div className={`service-content ${service.id % 2 === 0 ? 'content-left' : ' content-right'}`}>
//                   <h2>{service.title}</h2>
//                   <p>{service.description}</p>
//                   <button className="book-now-marketing">
//                     <span className="book-icon">▶</span> Book Now
//                   </button>
//                 </div>
//                 <div className={`service-image ${service.id % 2 === 0 ? 'image-right' : ' image-left'}`}>
//                   <img 
//                     src={service.image} 
//                     alt={service.title}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       );
// }

// export default CookMarketingSection


import React, { useEffect, useRef, useState } from 'react';
import "./CookMarketingSection.css";

const services = [
    {
        id: 1,
        title: "Cook For One Meal",
        description: "Enjoy the taste of Ghar Ka Khana, anytime you want. Our cooks prepare fresh, comforting meals tailored to your taste, right at home. Have a busy day, hosting a small gathering, or just don't feel like cooking? Skip the meal prep and let us serve up the delicious, homestyle food you crave, whenever you need it!",
        image: "/ServicesSection/CookingSection/chef-cooking-4.jpg",
    },
    {
        id: 2,
        title: "Cook For A Day",
        description: "From breakfast to dinner, our cook handles the entire cooking process, giving you a break from daily meal prep and letting you savor a variety of fresh, delicious home-cooked meals prepared right in your kitchen. Our cook for a day service is perfect for busy days, family visits, sick days, special occasions, and much more.",
        image: "/ServicesSection/CookingSection/chef-cooking-5.jpg",
    },
    {
        id: 3,
        title: "Chef For Party",
        description: "Make your next celebration unforgettable with our expert cooks who prepare delicious, multi-cuisine dishes tailored to your event. From appetizers to desserts, we ensure a seamless and stress-free hosting experience, allowing you to enjoy the festivities while we take care of the delicious details!",
        image: "/ServicesSection/CookingSection/chef-cooking-6.jpg",
    },
];

const CookMarketingSection = () => {
    const [visibleItems, setVisibleItems] = useState([]);
    const itemRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = Number(entry.target.getAttribute('data-id'));
    
                    if (entry.isIntersecting) {
                        setVisibleItems((prev) => [...new Set([...prev, id])]); // Ensure unique IDs
                    } else {
                        setVisibleItems((prev) => prev.filter((itemId) => itemId !== id));
                    }
                });
            },
            { threshold: 0.1 } // Trigger when 10% of the element is visible
        );
    
        itemRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });
    
        return () => {
            itemRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);
    

    return (
        <div className="services-section">
            <div className="nav-container container">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className={`service-item ${visibleItems.includes(service.id) ? 'visible' : ''}`}
                        ref={(el) => (itemRefs.current[service.id] = el)}
                        data-id={service.id}
                    >
                        <div className={`service-content ${service.id % 2 === 0 ? 'content-left' : 'content-right'}`}>
                            <h2>{service.title}</h2>
                            <p>{service.description}</p>
                            <button className="book-now-marketing">
                                <span className="book-icon">▶</span> Book Now
                            </button>
                        </div>
                        <div className={`service-image ${service.id % 2 === 0 ? 'image-right' : 'image-left'}`}>
                            <img src={service.image} alt={service.title} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CookMarketingSection;
