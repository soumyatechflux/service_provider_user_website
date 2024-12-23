
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules'; // Import Autoplay module
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HomeHeroSection.css';

const slides = [
  {
    title: "Convenience at Your Doorstep",
    service: "Your trusted professional services are now just a click away. Simplify your life with expert assistance anytime, anywhere.",
    buttonText: "Book Now",
    image: "./HomeHeroSection/category1.png",
  },
  {
    title: "Convenience at Your Doorstep",
    service: "Your trusted professional services are now just a click away. Simplify your life with expert assistance anytime, anywhere.",
    buttonText: "Book Now",
    image: "./HomeHeroSection/category2.png",
  },
  {
    title: "Convenience at Your Doorstep",
    service: "Your trusted professional services are now just a click away. Simplify your life with expert assistance anytime, anywhere.",
    buttonText: "Book Now",
    image: "./HomeHeroSection/category3.png",
  },
];

const HomeHeroSection = () => {
  return (
    <div className="swiper-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]} // Add Autoplay module
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 3000, 
          disableOnInteraction: false, 
        }}
        speed={1000} // Smooth transition speed in milliseconds
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="slide-content"
              style={{
                backgroundImage: `url(${slide.image})`, // Set background image
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="slide-text">
                <h2 className="slide-title">
                  {slide.title}
                </h2>
                <p style={{ fontWeight: 700 }} className="slide-service">{slide.service}</p>
                <div className='slide-btn-main'>
                  <button className="slide-button col-12">
                    <i className="bi bi-play-fill" style={{ marginRight: '5px' }}></i>
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeHeroSection;
