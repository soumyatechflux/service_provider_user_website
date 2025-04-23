import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TermsAndConditions.css"; 
import Loader from "../Loader/Loader";

const TermsAndConditions = () => {
  const [termsContent, setTermsContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/terms_and_conditions`
        );
        if (response?.data?.success) {
          setTermsContent(response.data.data.content);
        } else {
          console.error("Failed to fetch Terms and Conditions:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching Terms and Conditions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTermsAndConditions();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="sp-container">
      <div className="sp-header">
        <h1>Terms and Conditions</h1>
      </div>
      
      <div
        className="sp-content"
        dangerouslySetInnerHTML={{ __html: termsContent }}
      ></div>
    </div>
  );
};

export default TermsAndConditions;
