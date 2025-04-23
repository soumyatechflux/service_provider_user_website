// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules'; // Import Autoplay module
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import './HomeHeroSection.css';

// const slides = [
//   {
//     title: "Convenience at Your Doorstep",
//     service: "Your trusted professional services are now just a click away. Simplify your life with expert assistance anytime, anywhere.",
//     buttonText: "Book Now",
//     image: "./HomeHeroSection/category1.png",
//     link: "/services/cook-service", // Add navigation link
//   },
//   {
//     title: "Convenience at Your Doorstep",
//     service: "Your trusted professional services are now just a click away. Simplify your life with expert assistance anytime, anywhere.",
//     buttonText: "Book Now",
//     image: "./HomeHeroSection/category2.png",
//     link: "/services/driver-service",
//   },
//   {
//     title: "Convenience at Your Doorstep",
//     service: "Your trusted professional services are now just a click away. Simplify your life with expert assistance anytime, anywhere.",
//     buttonText: "Book Now",
//     image: "./HomeHeroSection/category3.png",
//     link: "/services/gardener-service", 
//   },
// ];

// const HomeHeroSection = () => {
//   const navigate = useNavigate(); 
//   const handleNavigation = (link) => {
//     navigate(link);
//   };

//   return (
//     <div className="swiper-container">
//       <Swiper
//         modules={[Navigation, Pagination, Autoplay]} 
//         spaceBetween={30}
//         slidesPerView={1}
//         navigation
//         pagination={{ clickable: true }}
//         loop={true}
//         autoplay={{
//           delay: 3000, 
//           disableOnInteraction: false, 
//         }}
//         speed={1000} 
//       >
//         {slides.map((slide, index) => (
//           <SwiperSlide key={index}>
//             <div
//               className="slide-content"
//               style={{
//                 backgroundImage: `url(${slide.image})`, 
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//               }}
//             >
//               <div className="slide-text">
//                 <h2 className="slide-title">
//                   {slide.title}
//                 </h2>
//                 <p style={{ fontWeight: 700 }} className="slide-service">{slide.service}</p>
//                 <div className='slide-btn-main'>
//                   <button
//                     className="slide-button col-12"
//                     onClick={() => handleNavigation(slide.link)} 
//                   >
//                     <i className="bi bi-play-fill" style={{ marginRight: '5px' }}></i>
//                     {slide.buttonText}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default HomeHeroSection;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules'; 
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HomeHeroSection.css';
import axios from 'axios';
import Loader from '../Loader/Loader';


const HomeHeroSection = () => {
  const [slides, setSlides] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleNavigation = (link) => {
    navigate(link);
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/banners`
        );

        if (response.data.success) {
          const bannerData = response.data.data.map((banner) => ({
            title: banner.title,
            service: banner.description,
            buttonText: "Book Now",
            image: banner.image,
            link: banner.url,
          }));

          setSlides(bannerData); 
        } else {
          console.error('Error fetching banners:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div className="swiper-container">
      {loading ? (
        <Loader /> 
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]} 
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{
            delay: 3000, 
            disableOnInteraction: false, 
          }}
          speed={1000}
        >
          {slides.length > 0 ? (
            slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div
                  className="slide-content"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="slide-text">
                    <h2 className="slide-title">{slide.title}</h2>
                    <p style={{ fontWeight: 700 }} className="slide-service">
                      {slide.service}
                    </p>
                    <div className="slide-btn-main">
                      <button
                        className="slide-button col-12"
                        onClick={() => handleNavigation(slide.link)}
                      >
                        <i className="bi bi-play-fill" style={{ marginRight: '5px' }}></i>
                        {slide.buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <p>No banners available</p>
          )}
        </Swiper>
      )}
    </div>
  );
};

export default HomeHeroSection;