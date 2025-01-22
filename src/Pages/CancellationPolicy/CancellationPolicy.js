import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CancellationPolicy.css"; 
import Loader from "../Loader/Loader";

const CancellationPolicy = () => {
  const [cancellationPolicyContent, setCancellationPolicyContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCancellationPolicy = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/cancellation_policy`
        );
        if (response?.data?.success) {
          setCancellationPolicyContent(response.data.data.content);
        } else {
          console.error("Failed to fetch Cancellation Policy:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching Cancellation Policy:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCancellationPolicy();
  }, []);

  return (
    <div className="cp-container">
      <div className="cp-header">
        <h1>Cancellation Policy</h1>
      </div>

      <div className="cp-content">
        {loading ? (
          <Loader /> 
        ) : (
          <div dangerouslySetInnerHTML={{ __html: cancellationPolicyContent }} />
        )}
      </div>
    </div>
  );
};

export default CancellationPolicy;
