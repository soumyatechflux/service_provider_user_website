// import React from "react";

// const HomeHeroSection = () => {
//   return (
//     <div id="carouselExampleCaptions" class="carousel slide">
//       <div class="carousel-indicators">
//         <button
//           type="button"
//           data-bs-target="#carouselExampleCaptions"
//           data-bs-slide-to="0"
//           class="active"
//           aria-current="true"
//           aria-label="Slide 1"
//         ></button>
//         <button
//           type="button"
//           data-bs-target="#carouselExampleCaptions"
//           data-bs-slide-to="1"
//           aria-label="Slide 2"
//         ></button>
//         <button
//           type="button"
//           data-bs-target="#carouselExampleCaptions"
//           data-bs-slide-to="2"
//           aria-label="Slide 3"
//         ></button>
//       </div>
//       <div class="carousel-inner">
//         <div class="carousel-item active">
//           <img src="..." class="d-block w-100" alt="..." />
//           <div class="carousel-caption d-none d-md-block">
//             <h5>First slide label</h5>
//             <p>Some representative placeholder content for the first slide.</p>
//           </div>
//         </div>
//         <div class="carousel-item">
//           <img src="..." class="d-block w-100" alt="..." />
//           <div class="carousel-caption d-none d-md-block">
//             <h5>Second slide label</h5>
//             <p>Some representative placeholder content for the second slide.</p>
//           </div>
//         </div>
//         <div class="carousel-item">
//           <img src="..." class="d-block w-100" alt="..." />
//           <div class="carousel-caption d-none d-md-block">
//             <h5>Third slide label</h5>
//             <p>Some representative placeholder content for the third slide.</p>
//           </div>
//         </div>
//       </div>
//       <button
//         class="carousel-control-prev"
//         type="button"
//         data-bs-target="#carouselExampleCaptions"
//         data-bs-slide="prev"
//       >
//         <span class="carousel-control-prev-icon" aria-hidden="true"></span>
//         <span class="visually-hidden">Previous</span>
//       </button>
//       <button
//         class="carousel-control-next"
//         type="button"
//         data-bs-target="#carouselExampleCaptions"
//         data-bs-slide="next"
//       >
//         <span class="carousel-control-next-icon" aria-hidden="true"></span>
//         <span class="visually-hidden">Next</span>
//       </button>
//     </div>
//   );
// };

// export default HomeHeroSection;


// import React from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import './HomeHeroSection.css';

// const slides = [
//   {
//     title: "WANT'S THE",
//     service: "CHEF SERVICE" ,
//     subtitle: "# On demand household services",
//     buttonText: "Book Now",
//     image: "./HomeHeroSection/cheaf.jpg"
//   },
//   {
//     title: "WANT'S THE",
//     service: "DRIVER SERVICE" ,
//     subtitle: "# On demand household services",
//     buttonText: "Book Now",
//     image: "./HomeHeroSection/cheaf.jpg"
//   },
//   {
//     title: "WANT'S THE",
//     service: "GARDENING SERVICE" ,
//     subtitle: "# On demand household services",
//     buttonText: "Book Now",
//     image: "./HomeHeroSection/cheaf.jpg"
//   },
  
//   // Add more slides as needed
// ];

// const StyledSwiperSlider = () => {
//   return (
//     <div className="swiper-container">
//       <Swiper
//         modules={[Navigation, Pagination]}
//         spaceBetween={30}
//         slidesPerView={1}
//         navigation
//         pagination={{ clickable: true }}
//         loop={true}
//       >
//         {slides.map((slide, index) => (
//           <SwiperSlide key={index}>
//             <div className="slide-content">
//               <img src={slide.image} alt="Chef" className="slide-image" />
//               <div className="slide-text">
//                 <p className="slide-subtitle">{slide.subtitle}</p>
//                 <p className="slide-title">{slide.title}<span style={{fontSize:"80px", fontWeight:"700"}}>{" "}{slide.service}</span></p>
//                 <button className="slide-button "><i className="bi bi-play-fill mr-1"></i>{slide.buttonText}</button>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default StyledSwiperSlider;

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
    service: "GARDENING SERVICE" ,
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
