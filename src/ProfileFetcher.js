import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfileFetcher = ({confirmLogout}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem("ServiceProviderUserToken");

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/active_status`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response?.status && response?.data?.success) {
          const data = response?.data?.data;

          if (data?.active_status !== "active") {

            // localStorage.removeItem("isDineRightUserLoggedIn");
            // localStorage.removeItem("encryptedTokenForDineRightUser");
            // sessionStorage.clear();
            // localStorage.clear();
            // navigate("/");
            // sessionStorage.setItem("IsLogedIn", "false");

            confirmLogout();
             navigate("/");

          }
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfile();
    const interval = setInterval(fetchProfile, 10000);

    return () => clearInterval(interval);
  }, [navigate]);

  return null;
};

export default ProfileFetcher;
