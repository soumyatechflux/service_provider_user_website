// import React from 'react'

// const DriverMarketingSection = () => {
//   return (
//     <div>DriverMarketingSection</div>
//   )
// }

// export default DriverMarketingSection

import React, { useEffect, useRef, useState } from 'react';
import "./DriverMarketingSection.css";

const services = [
    {
        id: 1,
        title: "Round trip",
        description: "With our expert drivers at the wheel, you can sit back, relax and enjoy the journey, knowing you are in safe hands. Our drivers will come to your location, providing safe and comfortable transportation. Whether you’re running errands, exploring local sights, or heading to meetings, we’ve got you covered",
        image: "./../ServicesSection/DriverServices/driverServices4.jpg",
    },
    {
        id: 2,
        title: "One way trip",
        description: "Experience the convenience of our One-Way Trip Driver Service. Our professional driver will pick you up at your location and drive you safely to any destination within the city. Whether you’re heading to an important meeting, a social event, or simply exploring the city, we ensure a smooth and comfortable ride.",
        image: "./../ServicesSection/DriverServices/driverServices5.jpg",
    },
    {
        id: 3,
        title: "One day ride",
        description: "Our one day ride service offers a dedicated driver for a fixed 12-hour slot, providing you with the flexibility and convenience you need for your daily travel. Ideal for business professionals, families, or anyone requiring consistent transportation, this service ensures you have a reliable driver at your disposal throughout the day.",
        image: "./../ServicesSection/DriverServices/driverServices6.jpg",
    },
    {
        id: 4,
        title: "Outstation trip",
        description: "Our Outstation Round Trip Driver Service provides reliable transportation for your journeys beyond the city limits. Whether you’re traveling for business, leisure, or special occasions, this service ensures a safe and comfortable ride to your destination and back.",
        image: "./../ServicesSection/DriverServices/driverServices7.jpg",
    },
];

const DriverMarketingSection = () => {
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

export default DriverMarketingSection;
