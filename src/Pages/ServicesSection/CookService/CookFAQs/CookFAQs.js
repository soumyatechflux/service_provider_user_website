import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './CookFAQs.css';

function CookFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false); // State to toggle FAQs view

  const token = sessionStorage.getItem("ServiceProviderUserToken");

  const fetchFAQs = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/faqs?${1}`,
        // { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('API Response:', response.data);

      // Filter FAQs by category_id = 1 (Cook section)
      const filteredFaqs = response.data.data.filter(faq => faq.category_id === 1);
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

  // Display only 5 FAQs initially, or all FAQs if showAll is true
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

export default CookFAQs;
