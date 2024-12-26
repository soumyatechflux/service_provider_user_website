// import React from 'react'

// const DriverFAQs = () => {
//   return (
//     <div>DriverFAQs</div>
//   )
// }

// export default DriverFAQs


import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './DriverFAQs.css';

const faqs = [
  {
    id: 1,
    question: "Can I customize my meal plan or menu?",
    answer: "Yes, feel free to discuss any specific meal requirements or preferences with your cook at the start of the service"
  },
  {
    id: 2,
    question: "How do I book a service?",
    answer: "You can book a service through our website by selecting your preferred service type, date, and time. Follow the simple booking process and make the payment to confirm your booking."
  },
  {
    id: 3,
    question: "What is the cancellation policy?",
    answer: "We understand plans can change. You can cancel your booking up to 24 hours before the scheduled service for a full refund. Cancellations within 24 hours may be subject to a cancellation fee."
  },
  {
    id: 4,
    question: "Are the professionals verified?",
    answer: "Yes, all our cooks undergo thorough background checks and verification processes. We ensure they have proper documentation and required certifications before joining our platform."
  },
  {
    id: 5,
    question: "How can I contact customer support?",
    answer: "Our customer support team is available 24/7. You can reach us through email at support@example.com, call us at 1-800-COOK, or use the chat feature on our website."
  }
];

function DriverFAQs() {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="faq-section">
      <div className="nav-container container">
        <h1 style={{fontSize:"36px"}}>FAQs</h1>
        <div className="faq-list">
          {faqs.map((faq) => (
            <div 
              key={faq.id} 
              className="faq-item"
            >
              <button
                className="faq-question"
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                aria-expanded={openId === faq.id}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <span>{faq.question}</span>
                {openId === faq.id ? (
                  <ChevronUp className="icon" />
                ) : (
                  <ChevronDown className="icon" />
                )}
              </button>
              <div 
                id={`faq-answer-${faq.id}`}
                className={`faq-answer ${openId === faq.id ? 'open' : ''}`}
                role="region"
                aria-labelledby={`faq-question-${faq.id}`}
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

export default DriverFAQs;

