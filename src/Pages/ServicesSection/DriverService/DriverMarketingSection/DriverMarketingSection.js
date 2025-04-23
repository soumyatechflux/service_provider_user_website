

// import React, { useEffect, useRef, useState } from 'react';
// import axios from "axios";
// import "./DriverMarketingSection.css";



// const DriverMarketingSection = () => {
//    const [services, setServices] = useState([]);
//        const [visibleItems, setVisibleItems] = useState([]);
//        const [loading, setLoading] = useState(true); // Loading state
//        const [error, setError] = useState(null); // Error state
//        const itemRefs = useRef([]);



//      // Fetch services data from the API
//      const fetchServices = async () => {
//         try {
//             const response = await axios.get(
//                 `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/services`
//             );

//             if (response.data.success) {
//                 // Filter services by id (e.g., id === 1)
//                 const filteredServices = response.data.data.filter(
//                     (service) => service.category_id === 2
//                 );
//                 setServices(filteredServices);
//             } else {
//                 setError("Failed to load services data.");
//             }
//         } catch (err) {
//             setError("An error occurred while fetching services data.");
//         } finally {
//             setLoading(false); // Stop loading after API call
//         }
//     };

//     useEffect(() => {
//         fetchServices();
//     }, []);

    

//     if (loading) {
//         return <div className="loader">Loading...</div>; // Replace with your custom loader if available
//     }

//     if (error) {
//         return <div className="error">{error}</div>;
//     }


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

// export default DriverMarketingSection;





import React, { useEffect, useRef, useState } from 'react';
import axios from "axios";
import "./DriverMarketingSection.css";

const DriverMarketingSection = () => {
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
                // Filter services by category_id (e.g., category_id === 2)
                const filteredServices = response.data.data.filter(
                    (service) => service.category_id === 2
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

    if (loading) {
        return <div className="loader">Loading...</div>; // Replace with your custom loader if available
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
                        className={`service-item ${visibleItems.includes(service.id) ? 'visible' : ''}`}
                        ref={(el) => (itemRefs.current[index] = el)} // Use index for refs
                        data-id={service.id}
                    >
                        <div className={`service-content ${index % 2 === 0 ? 'content-right' : 'content-left'}`}>
                            <h2 className='marketing-title'>{service.title}</h2>
                            <p className='marketing-description'>{service.description}</p>
                            <button onClick={scrollToTop} className="book-now-marketing">
                                <span className="book-icon">▶</span> Book Now
                            </button>
                        </div>
                        <div className={`service-image ${index % 2 === 0 ? 'image-left' : 'image-right'}`}>
                            <img src={service.image} alt={service.title} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DriverMarketingSection;
