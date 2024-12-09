
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules'; // Import Autoplay module
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HomeHeroSection.css';

const slides = [
  {
    title: "WANT'S THE",
    service: "CHEF SERVICE" ,
    subtitle: "# On demand household services",
    buttonText: "Book Now",
    image: "./HomeHeroSection/cheaf.jpg?height=400&width=400"
  },
  {
    title: "WANT'S THE",
    service: "DRIVER SERVICE" ,
    subtitle: "# On demand household services",
    buttonText: "Book Now",
    image: "./HomeHeroSection/driver.jpg?height=400&width=400"
  },
  {
    title: "WANT'S THE",
    service: "GARDENER SERVICE" ,
    subtitle: "# On demand household services",
    buttonText: "Book Now",
    image: "./HomeHeroSection/gardener.jpg?height=400&width=400"
  },
];

const HomeHeroSection = () => {
  return (
    <div className="swiper-container ">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]} // Add Autoplay module
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 3000, // Time between slides (3 seconds)
          disableOnInteraction: false, // Keeps autoplay active after user interaction
        }}
        speed={1000} // Smooth transition speed in milliseconds
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="slide-content">
              <img src={slide.image} alt={slide.service} className="slide-image" />
              <div className="slide-text">
                <p className="slide-subtitle">{slide.subtitle}</p>
                <h2 className="slide-title">
                  {slide.title}
                  <br />
                  <span style={{ fontWeight: 700 }}>{slide.service}</span>
                </h2>
                <div>
                <button className="slide-button">
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
