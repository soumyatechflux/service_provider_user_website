import React, { useState, useEffect } from "react";
import "./AboutUsInfo.css";
import Loader from "../../Loader/Loader";

const AboutUsInfo = () => {
  const [aboutData, setAboutData] = useState({
    title: "",
    subtitle: "",
    description1: "",
    description2: "",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutUsData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/about_us`
        );
        const data = await response.json();

        if (data.success) {
          setAboutData(data.data); 
        } else {
          console.error("Failed to fetch About Us data");
        }
      } catch (error) {
        console.error("Error fetching About Us data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUsData();
  }, []); 

  if (loading) {
    return <Loader />; 
  }

  return (
    <div className="container nav-container about-us-container">
      <div className="image-flex-wrapper">
        {/* Top Row */}
        <div className="image-flex-wrapper-top">
          <div>
            <img className="image-box image-top-left" src={aboutData.image1} alt="Top Left" />
          </div>
          <div>
            <img className="image-box image-top-right" src={aboutData.image2} alt="Top Right" />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="image-flex-wrapper-bottom">
          <div>
            <img className="image-box image-bottom-left" src={aboutData.image3} alt="Bottom Left" />
          </div>
          <div>
            <img className="image-box image-bottom-right" src={aboutData.image4} alt="Bottom Right" />
          </div>
        </div>
      </div>

      <div className="text-section">
        <h1 className="title">{aboutData.title}</h1>
        <h3 className="subtitle">{aboutData.subtitle}</h3>
        <p className="description">{aboutData.description1}</p>
        <p className="description">{aboutData.description2}</p>
      </div>
    </div>
  );
};

export default AboutUsInfo;