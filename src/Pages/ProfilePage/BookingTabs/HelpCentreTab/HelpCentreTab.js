import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Calendar } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../Loader/Loader";
import "./HelpCentreTab.css";

const HelpCentreTab = () => {
  const location = useLocation();
  const bookingId = location.state?.booking_id || ""; // Get booking_id from navigation

  const [query, setQuery] = useState("");
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_API_URL = process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL;
  const POST_API_URL = `${BASE_API_URL}/api/customer/help_center/add`;
  const GET_API_URL = `${BASE_API_URL}/api/customer/help_center/${bookingId}`; // Fetch booking-wise

  // Fetch previous queries when component loads
  useEffect(() => {
    if (!bookingId) {
      toast.error("Booking ID is missing.");
      return;
    }

    const fetchQueries = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem("ServiceProviderUserToken");

        const response = await axios.get(GET_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && response.data.data) {
          const item = response.data.data; // Extract single object

          // Convert the single object into an array
          setQueries([
            {
              id: item.id,
              query: item.description,
              status: item.status,
              createddate: new Date(item.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              updateddate: new Date(item.updated_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
            },
          ]);
        } else {
          setQueries([]); // Empty state if no data found
        }
      } catch (error) {
        console.error("Error fetching queries:", error);
        toast.error("Failed to load previous queries.");
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, [bookingId]); // Runs when bookingId changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim() === "" || !bookingId) {
      toast.error("Please enter a query and make sure booking_id is available.");
      return;
    }

    setLoading(true);

    try {
      const token = sessionStorage.getItem("ServiceProviderUserToken");

      const response = await axios.post(
        POST_API_URL,
        { booking_id: bookingId, description: query },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { booking_id, description } = response.data;

      // Update state with new query
      setQueries((prevQueries) => [
        ...prevQueries,
        {
          id: booking_id,
          query: description,
          status: "Pending",
          createddate: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          updateddate: "Just now",
        },
      ]);

      setQuery(""); // Clear input field
      toast.success("Your query has been submitted successfully! 🎉");
    } catch (error) {
      console.error("Error submitting query:", error);
      toast.error("Failed to submit query. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="help-center-container">
      <h1 className="help-center-title">Help Center</h1>

      <form onSubmit={handleSubmit} className="query-form">
        <div className="form-group">
          <div className="Service-Heading">Service Name</div>
          <label htmlFor="user-query">Have a question?</label>
          <textarea
            id="user-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your issue here..."
            rows={4}
            disabled={loading}
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit Query"}
        </button>
      </form>

      {loading && <Loader />} {/* Show loader while fetching */}

      <h2 className="section-title">Previous Queries</h2>
      <div className="cards-grid">
        {queries.length > 0 ? (
          queries.map((item) => (
            <div key={item.id} className={`card-helpcentre ${item.status.toLowerCase()}`}>
              <div className="card-header">
                <h3 className="card-date">Created Date : {item.createddate}</h3>
                <div className="card-time">
                  <Calendar className="calendar-icon" /> Updated Date : {item.updateddate}
                </div>
              </div>
              <div className="card-content">
                <p className="query-text">{item.query}</p>
                <span className={`status-badge ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-queries">No previous queries found.</p>
        )}
      </div>
    </div>
  );
};

export default HelpCentreTab;
