import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './GardenerFAQs.css';

function GardenerFAQs() {
  const [faqs, setFaqs] = useState([]); // Initialize faqs state
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem("ServiceProviderUserToken");

  // Fetch FAQs from the API
  const fetchFAQs = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_USER_WEBSITE_BASE_API_URL}/api/customer/faqs?${1}`,
        // { headers: { Authorization: `Bearer ${token}` } }
      );

      // Filter FAQs where category_id is 3 (Gardener category)
      const filteredFaqs = response.data.data.filter(faq => faq.category_id === 3);
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

  return (
    <div className="faq-section">
      <div className="nav-container container">
        <h1 style={{ fontSize: "36px" }}>FAQs</h1>
        <div className="faq-list">
          {faqs.map((faq) => (
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
      </div>
    </div>
  );
}

export default GardenerFAQs;