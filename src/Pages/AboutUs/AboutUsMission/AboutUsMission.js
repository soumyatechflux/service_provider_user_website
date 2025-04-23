import React, { useState, useEffect } from "react";
import "./AboutUsMission.css";

const AboutUsMission = () => {
  const [missionData, setMissionData] = useState({
    our_mission_description: "",
    counter1: "",
    counter2: "",
    counter3: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissionData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/about_us`
        );
        const data = await response.json();

        if (data.success) {
          setMissionData({
            our_mission_description: data.data.our_mission_description,
            counter1: data.data.counter1,
            counter2: data.data.counter2,
            counter3: data.data.counter3,
          });
        } else {
          console.error("Failed to fetch About Us mission data");
        }
      } catch (error) {
        console.error("Error fetching About Us mission data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMissionData();
  }, []);

  

  return (
    <div>
      <div className="container nav-container mission-section">
        <div className="text-center">
          {/* Mission Heading */}
          <h2 className="mission-heading">Our Mission</h2>
          <div className="mission-quote">
            <img className="quote-images" src="./../ServicesSection/AboutUs/Quote3.jpg" alt="Quote 1" />
            <p className="mission-text">{missionData.our_mission_description}</p>
            <img className="quote-images" src="./../ServicesSection/AboutUs/Quote2.jpg" alt="Quote 2" />
          </div>
        </div>
      </div>

      <div className="mission-stats">
        <div className="stat">
          <h3>{missionData.counter1}+</h3>
          <p>People Served</p>
        </div>
        <div className="stat">
          <h3>{missionData.counter2}+</h3>
          <p>Verified and Trained Professionals</p>
        </div>
        <div className="stat">
          <h3>{missionData.counter3}+</h3>
          <p>Cities</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsMission;