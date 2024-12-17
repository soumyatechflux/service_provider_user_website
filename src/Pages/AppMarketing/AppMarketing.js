import React, { useEffect, useRef } from "react";
import "./AppMarketing.css";

const AppMarketing = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          } else {
            entry.target.classList.remove("animate");
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% of the section is visible
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <div className="col-md-12 col-12 hero-container" ref={sectionRef}>
      <div className="col-md-4 col-12 content">
        <p className="subtitle-app">No more switching apps</p>
        <h1 className="title-app">
          Why download many
          <br />
          when one app can do it all?
        </h1>
        <div className="badges">
          <div className="rating-badge">
            <div className="rating-div">
              <span className="rating-app">4.8/5</span>
              <span className="rating-sub-text">Average Rating</span>
            </div>
            <div>
              <img
                src="./AppMarketing/rating.png"
                alt="Rating stars"
                className="stars"
              />
            </div>
          </div>
          <div className="feature-badge">
            <div className="rating-div">
              <span className="rating-app">One-App</span>
              <span className="rating-sub-text">Convenience</span>
            </div>
            <div>
              <img
                src="./AppMarketing/tik.png"
                alt="Feature badge"
                className="stars"
              />
            </div>
          </div>
          <div className="feature-badge">
            <div className="rating-div">
              <span className="rating-app">Fast booking</span>
              <span className="rating-sub-text">In under 2 minutes</span>
            </div>
            <div>
              <img
                src="./AppMarketing/person.png"
                alt="Feature badge"
                className="stars"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-8 col-12 mobile-margin">
        <div className="path-shadow">
          <img src="./AppMarketing/shadow.png" alt="App shadow" />
        </div>
        <div className="phone-container">
          <div className="phone">
            <img
              src="./AppMarketing/iPhone_13.png"
              alt="App interface"
              className="phone-screen"
            />
          </div>
        </div>
        <div className="door-container">
          <img
            src="./AppMarketing/Door_and_provider.png"
            alt="People illustration"
            width={200}
            height={350}
            className="door-image"
          />
        </div>
      </div>
    </div>
  );
};

export default AppMarketing;
