import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./WhyChooseUs.css"; // Custom CSS file for this section

const WhyChooseUs = () => {
  const items = [
    {
      icon: "bi bi-door-closed",
      title: "One home, one-stop solution",
    },
    {
      icon: "bi bi-shield-check",
      title: "Verified and trained",
    },
    {
      icon: "bi bi-calendar2-check",
      title: "Easy and prompt booking",
    },
    {
      icon: "bi bi-gear",
      title: "Customized to your needs",
    },
  ];

  return (
    <div className="container why-choose-us-container text-center pages-margin">
      <h2 className="why-choose-us-title mb-5">Why Choose Us</h2>
      <div className="row justify-content-center">
        {items.map((item, index) => (
          <div key={index} className="col-6 col-md-3 ">
            <div className="why-choose-us-icon-container mx-auto">
              <i className={item.icon}></i>
            </div>
            <p className="why-choose-us-text text-center mt-3">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
