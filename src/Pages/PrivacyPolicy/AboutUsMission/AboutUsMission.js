// import React from 'react'

// const AboutUsMission = () => {
//   return (
//     <div>AboutUsMission</div>
//   )
// }

// export default AboutUsMission





import React from "react";
import "./AboutUsMission.css";

const AboutUsMission = () => {
  return (
    <div>
    <div className="container nav-container mission-section">
      <div className="text-center">
        {/* Mission Heading */}
        <h2 className="mission-heading">Our Mission</h2>
        <div className="mission-quote">
        <img className="quote-images"  src="./../ServicesSection/AboutUs/Quote3.jpg"/>
          <p className="mission-text">
            Our mission is simple: To take the stress out of daily home chores,
            allowing you to focus on what matters most.
          </p>
          <img className="quote-images" src="./../ServicesSection/AboutUs/Quote2.jpg"/>
        </div>
        {/* Stats Section */}
        
      </div>
      </div>

      <div className="mission-stats">
          <div className="stat">
            <h3>200+</h3>
            <p>People Served</p>
          </div>
          <div className="stat">
            <h3>150+</h3>
            <p>Verified and Trained Professionals</p>
          </div>
          <div className="stat">
            <h3>6+</h3>
            <p>Cities</p>
          </div>
        </div>
    </div>
  );
};

export default AboutUsMission;
