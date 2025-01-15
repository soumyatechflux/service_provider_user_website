import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './DriverFAQs.css';

function DriverFAQs() {
  const [faqs, setFaqs] = useState([]); // Initialize faqs state
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false); // State to toggle between limited and full FAQ view

  const token = sessionStorage.getItem("ServiceProviderUserToken");

  const fetchFAQs = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/faqs?${1}`,
        // { headers: { Authorization: `Bearer ${token}` } }
      );

      // Filter FAQs where category_id is 2 (Driver category)
      const filteredFaqs = response.data.data.filter(faq => faq.category_id === 2);
      setFaqs(filteredFaqs);
    } catch (err) {
      setError('Failed to fetch FAQs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  if (loading) {
    return <div className="faq-section">Loading FAQs...</div>;
  }

  if (error) {
    return <div className="faq-section">{error}</div>;
  }

  // Determine FAQs to display based on `showAll` state
  const displayedFaqs = showAll ? faqs : faqs.slice(0, 5);

  return (
    <div className="faq-section">
      <div className="nav-container container">
        <h1 style={{ fontSize: "36px" }}>FAQs</h1>
        <div className="faq-list">
          {displayedFaqs.map((faq) => (
            <div key={faq.faq_id} className="faq-item">
              <button
                className="faq-question"
                onClick={() => setOpenId(openId === faq.faq_id ? null : faq.faq_id)}
                aria-expanded={openId === faq.faq_id}
                aria-controls={`faq-answer-${faq.faq_id}`}
              >
                <span>{faq.question}</span>
                {openId === faq.faq_id ? (
                  <ChevronUp className="icon" />
                ) : (
                  <ChevronDown className="icon" />
                )}
              </button>
              <div
                id={`faq-answer-${faq.faq_id}`}
                className={`faq-answer ${openId === faq.faq_id ? 'open' : ''}`}
                role="region"
                aria-labelledby={`faq-question-${faq.faq_id}`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
        <button
          className="view-more-button2"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "View Less" : "View More FAQs"}
        </button>
      </div>
    </div>
  );
}

export default DriverFAQs;
