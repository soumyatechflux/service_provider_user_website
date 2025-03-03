import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NotificationCenter.css"; 
import Loader from "../Loader/Loader";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/notifications`
        );

        if (response?.data?.success) {
          const recentNotifications = response.data.data.filter((notification) => {
            const notificationTime = new Date(notification.created_at).getTime();
            const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
            return notificationTime >= thirtyDaysAgo;
          });

          setNotifications(recentNotifications);
        } else {
          console.error("Failed to fetch notifications:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);
  
  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    };
    return new Date(dateString).toLocaleString("en-GB", options);
  };

  return (
    <div className="sp-container">
      <div className="sp-header">
        <h1>Notification Center</h1>
      </div>
      <div className="sp-content">
        {loading ? (
          <Loader />
        ) : notifications.length === 0 ? (
          <p className="no-notifications">No notifications available</p>
        ) : (
          <div className="notification-list">
            {notifications.map((notification) => (
              <div key={notification.notification_id} className="notification-card">
                <div className="notification-title">
                  {notification.title} <span className="notification-type">{notification.notification_type}</span>
                </div>
                <p className="notification-message mb-0">{notification.message}</p>
                <p className="notification-date mb-0">{formatDate(notification.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
