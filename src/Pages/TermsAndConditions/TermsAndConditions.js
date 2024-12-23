// import React from "react";
// import "./AboutUs.css";

// const AboutUs = () => {
//   // Data constant
//   const aboutData = {
//     title: "Servyo",
//     subtitle: "Service At Yo’ Doorstep!",
//     description: [
//       "Servyo offers on-demand household services for all your home needs—drivers, chefs, gardeners, and more. Our vision is to connect Indian households with friendly and reliable professionals who can help with daily tasks.",
//       "We understand the challenges of managing a home, and we want to take some of that load off your shoulders, allowing you to enjoy your home and spend more time with your loved ones. Let us serve you and make your everyday life a little easier!",
//     ],
//   };

//   return (
//     <div className="container nav-container about-us-container">
//       <div className="image-flex-wrapper">
//         {/* Top Row */}
//         <div className="image-flex-wrapper-top">
//           <div >
//             <img className="image-box image-top-left" src="./../ServicesSection/AboutUs/testing4.jpg" />
//           </div>
//           <div >
//             <img className="image-box image-top-right" src="./../ServicesSection/AboutUs/testing.jpg" />
//           </div>
//         </div>

//         {/* Bottom Row */}
//         <div className="image-flex-wrapper-bottom">
//           <div >
//             <img className="image-box image-bottom-left" src="./../ServicesSection/AboutUs/testing2.jpg" />
//           </div>
//           <div >
//             <img className="image-box image-bottom-right" src="./../ServicesSection/AboutUs/testing3.jpg"/>
//           </div>
//         </div>
//       </div>
//       <div className="text-section">
//         <h1 className="title">{aboutData.title}</h1>
//         <h3 className="subtitle">{aboutData.subtitle}</h3>
//         {aboutData.description.map((para, index) => (
//           <p key={index} className="description">
//             {para}
//           </p>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AboutUs;



import React from 'react'
import AboutUsInfo from './AboutUsInfo/AboutUsInfo'
import AboutUsMission from './AboutUsMission/AboutUsMission'
import MeetOurTeam from './MeetOurTeam/MeetOurTeam'
import NewsLetter from './NewsLetter/NewsLetter'

const TermsAndConditions = () => {
  return (
    <div>
      {/* <AboutUsInfo/>
      <AboutUsMission/>
      <MeetOurTeam/>
      <NewsLetter/> */}

      <div style={{minHeight:"100vh"}}>
        <span>
         Terms And Conditions
        </span>
      </div>
      
    </div>
  )
}

export default TermsAndConditions