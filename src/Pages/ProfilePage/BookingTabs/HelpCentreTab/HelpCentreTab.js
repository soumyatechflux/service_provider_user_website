import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import to get passed state
import { toast } from "react-toastify";
import axios from "axios";
import { Calendar } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../Loader/Loader";
import "./HelpCentreTab.css";
import MessageModal from "../../../MessageModal/MessageModal";

const HelpCentreTab = () => {

  const location = useLocation();
  const { booking_id, sub_category_name } = location.state || {}; // Get booking details
  const [query, setQuery] = useState("");
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
 const [message, setMessage] = useState("");
 const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);
  



  const BASE_API_URL = process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL; // Get base URL from env
  const POST_API_URL = `${BASE_API_URL}/api/customer/help_center/add`;
  const GET_API_URL = `${BASE_API_URL}/api/customer/help_center`; // Fetch all queries for the user

  // Fetch previous queries when component loads
  useEffect(() => {
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
          const data = response.data.data;
  
          // Filter queries to only include those with matching booking_id
          const filteredQueries = data.filter(item => item.booking_id === booking_id);
  
          setQueries(
            filteredQueries.map((item) => ({
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
            }))
          );
        } else {
          setQueries([]); // Empty state if no data found
        }
      } catch (error) {
        console.error("Error fetching queries:", error);
        setMessage("Failed to load previous queries.");
        handleShow();
      } finally {
        setLoading(false);
      }
    };
  
    if (booking_id) {
      fetchQueries(); // Fetch only if booking_id is available
    }
  }, [booking_id]); // Re-run effect when booking_id changes
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim() === "") {
      // toast.error("Please enter a query.");
      setMessage("Please enter a query.");
      handleShow();
      return;
    }

    setLoading(true);

    try {
      const token = sessionStorage.getItem("ServiceProviderUserToken");

      const response = await axios.post(
        POST_API_URL,
        { description: query },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { description } = response.data;

      // Update state with new query
      setQueries((prevQueries) => [
        ...prevQueries,
        {
          id: response.data.booking_id,
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
      // toast.success("Your query has been submitted successfully! 🎉");
      setMessage("Your query has been submitted successfully! 🎉");
      handleShow();

    } catch (error) {
      console.error("Error submitting query:", error);
      // toast.error("Failed to submit query. Please try again.");
      setMessage("Failed to submit query. Please try again.");
      handleShow();

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="help-center-container">
      <h1 className="help-center-title">Raise a Ticket related to Booking</h1>

      <form onSubmit={handleSubmit} className="query-form">
        <div className="form-group">
        <div className="Service-Heading">
            {sub_category_name ? `Service Name - ${sub_category_name}  ` : "Service Name"}
          </div>
          <label htmlFor="user-query">Tell us About Your Issue !</label>
          <textarea
            id="user-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your issue here..."
            rows={4}
            disabled={loading}
          />
        </div>
        <button type="submit" className="submit-button">Submit Ticket</button>
      </form>

      {loading && <Loader />} {/* Show loader while fetching */}

      <h2 className="section-title">Previous Tickets</h2>
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
      <MessageModal
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        message={message}
      />
    </div>
  );
};

export default HelpCentreTab;
