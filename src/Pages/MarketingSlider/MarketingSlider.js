import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./MarketingSlider.css";

const slides = [
  {
    id: 1,
    image: "./MarketingSlider/marketing1.png",
    text: "End Your Night Right—Safe Rides, Every Time",
  },
  {
    id: 2,
    image: "./MarketingSlider/marketing2.png",
    text: "Memorable Meals for Memorable Occasions",
  },
  {
    id: 3,
    image: "./MarketingSlider/marketing3.png",
    text: "Traffic's a Mess—Your Ride Doesn't Have to Be",
  },
  {
    id: 4,
    image: "./MarketingSlider/marketing4.png",
    text: "Your Daily Meals, Cooked Fresh Right in Your Kitchen",
  },
  {
    id: 5,
    image: "./MarketingSlider/marketing5.png",
    text: "You Catch Up on Work, We'll Catch Up on Road",
  },
  {
    id: 6,
    image: "./MarketingSlider/marketing6.png",
    text: "A Perfect Garden, Every Season",
  },
];

const MarketingSlider = () => {
  // const settings = {
  //   dots: false,
  //   infinite: true,
  //   speed: 800,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   autoplay: true,
  //   autoplaySpeed: 3000,
  //   arrows: true, // Enable default arrows
  // };

  const settings = {
    dots: false,
    infinite: true,
    speed: 0, // No transition effect
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Change slides every 1 second
    arrows: true,
  };
  
  return (
    // <div className="marketing-slider-container">
    //   <Slider {...settings}>
    //     {slides.map((slide) => (
    //       <div key={slide.id} className="marketing-slide">
    //         <img
    //           src={slide.image}
    //           alt={`Slide ${slide.id}`}
    //           className="marketing-slide-image"
    //         />
    //         <div className="marketing-slide-text">{slide.text}</div>
    //       </div>
    //     ))}
    //   </Slider>
    // </div>
    <div className="marketing-slider-container">
    <Slider {...settings}>
      {slides.map((slide) => (
        <div key={slide.id} className="marketing-slide">
          <img
            src={slide.image}
            alt={`Slide ${slide.id}`}
            className="marketing-slide-image"
          />
          <div className="marketing-slide-text">{slide.text}</div>
        </div>
      ))}
    </Slider>
  </div>
  );
};

export default MarketingSlider;
