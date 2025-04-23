import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./WhyChooseUs.css"; // Custom CSS file for this section

const WhyChooseUs = () => {
  const items = [
    {
      image: "./WhyChooseUs/door.png", // Path to the image
      title: "One home, one-stop solution",
    },
    {
      image: "./WhyChooseUs/Icon.png", // Path to the image
      title: "Verified and trained",
    },
    {
      image: "./WhyChooseUs/cal.png", // Path to the image
      title: "Easy and prompt booking",
    },
    {
      image: "./WhyChooseUs/gear.png", // Path to the image
      title: "Customized to your needs",
    },
  ];

  return (
    <div className="container why-choose-us-container text-center">
      <h2 className="why-choose-us-title mb-5">Why Choose Us</h2>
      <div className="row justify-content-center" style={{ gap: "0px" }}>
        {items.map((item, index) => (
          <div key={index} className="col-6 col-md-3 mt-3">
            <div className="why-choose-us-icon-container mx-auto">
              <img
                src={item.image}
                alt={item.title}
                className="responsive-image"
              />
            </div>
            <p className="why-choose-us-text text-center mt-3">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;

