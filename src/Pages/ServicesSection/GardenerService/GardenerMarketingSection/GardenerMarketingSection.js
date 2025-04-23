// import React, { useEffect, useRef, useState } from 'react';
// import "./GardenerMarketingSection.css";

// const services = [
//     {
//         id: 1,
//         title: "One visit gardener",
//         description: "Experience the ease of garden maintenance with our professional gardeners at your service for a one-time visit. Whether it’s your home or workspace, our partners bring expertise and attention to detail, ensuring your outdoor space looks its best without the hassle.",
//         image: "./../ServicesSection/GardenerServices/gardener4.jpg",
//     },
//     {
//         id: 2,
//         title: "Monthly Package",
//         description: "Keep your garden flourishing year-round with our convenient Monthly Package. With 2 to 4 visits a month, our professionals handle all the maintenance, making it easy for you to enjoy a beautiful outdoor space without the stress. Subscribe today for a healthy green space and peace of mind!",
//         image: "./../ServicesSection/GardenerServices/gardener5.jpg",
//     },
// ];

// const GardenerMarketingSection = () => {
//     const [visibleItems, setVisibleItems] = useState([]);
//     const itemRefs = useRef([]);

//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 entries.forEach((entry) => {
//                     const id = Number(entry.target.getAttribute('data-id'));
    
//                     if (entry.isIntersecting) {
//                         setVisibleItems((prev) => [...new Set([...prev, id])]); // Ensure unique IDs
//                     } else {
//                         setVisibleItems((prev) => prev.filter((itemId) => itemId !== id));
//                     }
//                 });
//             },
//             { threshold: 0.1 } // Trigger when 10% of the element is visible
//         );
    
//         itemRefs.current.forEach((ref) => {
//             if (ref) observer.observe(ref);
//         });
    
//         return () => {
//             itemRefs.current.forEach((ref) => {
//                 if (ref) observer.unobserve(ref);
//             });
//         };
//     }, []);

//     return (
//         <div className="services-section">
//             <div className="nav-container container">
//                 {services.map((service) => (
//                     <div
//                         key={service.id}
//                         className={`service-item ${visibleItems.includes(service.id) ? 'visible' : ''}`}
//                         ref={(el) => (itemRefs.current[service.id] = el)}
//                         data-id={service.id}
//                     >
//                         <div className={`service-content ${service.id % 2 === 0 ? 'content-left' : 'content-right'}`}>
//                         <h2 className='marketing-title'>{service.title}</h2>
//                         <p className='marketing-description'>{service.description}</p>
//                             <button className="book-now-marketing">
//                                 <span className="book-icon">▶</span> Book Now
//                             </button>
//                         </div>
//                         <div className={`service-image ${service.id % 2 === 0 ? 'image-right' : 'image-left'}`}>
//                             <img src={service.image} alt={service.title} />
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default GardenerMarketingSection;




import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./GardenerMarketingSection.css";

const GardenerMarketingSection = () => {
    const [services, setServices] = useState([]);
    const [visibleItems, setVisibleItems] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const itemRefs = useRef([]);

    // Fetch services data from the API
    const fetchServices = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/services`
            );

            if (response.data.success) {
                // Filter services by category_id (e.g., Gardener's category_id === 3)
                const filteredServices = response.data.data.filter(
                    (service) => service.category_id === 3
                );
                setServices(filteredServices);
            } else {
                setError("Failed to load services data.");
            }
        } catch (err) {
            setError("An error occurred while fetching services data.");
        } finally {
            setLoading(false); // Stop loading after API call
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Intersection Observer for visibility animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = Number(entry.target.getAttribute("data-id"));

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

    if (loading) {
        return <div className="loader">Loading...</div>; // Replace with your custom loader
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth', // Adds smooth scrolling
        });
      };

    return (
        <div className="services-section">
            <div className="nav-container container">
                {services.map((service, index) => (
                    <div
                        key={service.id}
                        className={`service-item ${
                            visibleItems.includes(service.id) ? "visible" : ""
                        }`}
                        ref={(el) => (itemRefs.current[index] = el)} // Use index for refs
                        data-id={service.id}
                    >
                        <div
                            className={`service-content ${
                                index % 2 === 0 ? "content-right" : "content-left"
                            }`}
                        >
                            <h2 className="marketing-title">{service.title}</h2>
                            <p className="marketing-description">{service.description}</p>
                            <button onClick={scrollToTop} className="book-now-marketing">
                                <span className="book-icon">▶</span> Book Now
                            </button>
                        </div>
                        <div
                            className={`service-image ${
                                index % 2 === 0 ? "image-left" : "image-right"
                            }`}
                        >
                            <img src={service.image} alt={service.title} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GardenerMarketingSection;
