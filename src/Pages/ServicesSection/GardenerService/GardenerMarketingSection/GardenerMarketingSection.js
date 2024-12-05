import React, { useEffect, useRef, useState } from 'react';
import "./GardenerMarketingSection.css";

const services = [
    {
        id: 1,
        title: "One visit gardener",
        description: "Experience the ease of garden maintenance with our professional gardeners at your service for a one-time visit. Whether it’s your home or workspace, our partners bring expertise and attention to detail, ensuring your outdoor space looks its best without the hassle.",
        image: "./../ServicesSection/GardenerServices/gardener4.jpg",
    },
    {
        id: 2,
        title: "Monthly subscription",
        description: "Keep your garden flourishing year-round with our convenient monthly subscription. With 2 to 4 visits a month, our professionals handle all the maintenance, making it easy for you to enjoy a beautiful outdoor space without the stress. Subscribe today for a healthy green space and peace of mind!",
        image: "./../ServicesSection/GardenerServices/gardener5.jpg",
    },
];

const GardenerMarketingSection = () => {
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

export default GardenerMarketingSection;
