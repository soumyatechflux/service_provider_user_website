import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PrivacyPolicy.css"; 
import Loader from "../Loader/Loader";

const PrivacyPolicy = () => {
  const [privacyPolicyContent, setPrivacyPolicyContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/privacy_policy`
        );
        if (response?.data?.success) {
          setPrivacyPolicyContent(response.data.data.content);
        } else {
          console.error("Failed to fetch Privacy Policy:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching Privacy Policy:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  return (
    <div className="sp-container">
      <div className="sp-header">
        <h1>Privacy Policy</h1>
      </div>
      <div className="sp-content">
        {loading ? (
          <Loader />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: privacyPolicyContent }} />
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
