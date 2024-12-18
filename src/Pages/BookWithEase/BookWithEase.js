import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BookWithEase.css"; 

const BookWithEase = () => {
  const steps = [
    {
      icon: "./BookWithEase/app.jpg",
      title: "Register on app",
      description: "Download the Servyo app and register yourself",
    },
    {
      icon: "./BookWithEase/service.jpg",
      title: "Select service",
      description:
        "Choose from the range of services and customise as per your needs",
    },
    {
      icon: "./BookWithEase/calendar.jpg",
      title: "Choose date and time",
      description: "Book your slot as per your convenience and availability",
    },
    {
      icon: "./BookWithEase/sitback.jpg",
      title: "Sit back and relax",
      description: "Enjoy the service as our expert arrives at your doorstep",
    },
  ];

  return (
    <div className="container-bg-book">
      <div className=" container nav-container book-ease-container pages-margin mb-2">
        <h2 className="book-ease-title text-center services-title">Book With Ease</h2>
        <div className="container">
          <div className="row justify-content-center services-div">
            {steps.map((step, index) => (
              <div
                key={index}
                className="col-12 col-sm-6 col-md-3 book-ease-step "
              >
                <div className="book-ease-card text-left mb-2">
                  <div className="book-ease-icon mb-3">
                    <img src={step.icon}/>
                  </div>
                  <h5 className="book-ease-step-title">{step.title}</h5>
                  <p className="book-ease-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookWithEase;
