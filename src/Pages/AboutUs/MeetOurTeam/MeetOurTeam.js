import React from "react";
import "./MeetOurTeam.css";

const MeetOurTeam = () => {
  const teamData = [
    {
      id: 1,
      name: "Riya Bansal",
      role: "Co-Founder",
      // image: "./../ServicesSection/AboutUs/ProfilePic.jpg", 
      image: "./MeetOurTeam/Riya.jpg", // Replace with the correct image path
      linkedin: "https://www.linkedin.com/in/riyabansal7/",
    },
    {
      id: 2,
      name: "Priyasha Goel",
      role: "Co-Founder",
      // image: "./../ServicesSection/AboutUs/ProfilePic.jpg", 
      image: "./MeetOurTeam/Priyasha.JPG", // Replace with the correct image path
      linkedin: "https://www.linkedin.com/in/priyasha-goel-1601/",
    },
  ];

  return (
    <div className="container nav-container team-section">
      <h2 className="team-title">Meet Our Team</h2>
      <div className="team-container">
        {teamData.map((member) => (
          <div key={member.id} className="team-card">
            <img src={member.image} alt={member.name} className="team-image" />
            <h3 className="team-name">{member.name}</h3>
            <p className="team-role">{member.role}</p>
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-icon"
            >
              <img
                src="./../ServicesSection/AboutUs/Linkedin.jpg" // Replace with your LinkedIn icon path
                alt="LinkedIn"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetOurTeam;
