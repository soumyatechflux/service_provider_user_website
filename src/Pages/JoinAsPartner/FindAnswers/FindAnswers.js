import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './FindAnswers.css';

const faqs = [
  {
    id: 1,
    question: "What is Servyo and what services do you provide?",
    answer: "Servyo is a one-stop solution for on demand household services for all your home needs. We currently provide driver, cook, and gardener services for your homes. Please check out the 'about us' section for more information about Servyo."
  },
  {
    id: 2,
    question: "How do I book a service?",
    answer: "You can book a service (cook, driver, gardener) through our app or website by selecting the service type and providing the required details to complete the booking."
  },
  {
    id: 3,
    question: "Are your service providers trained and vetted?",
    answer: "Absolutely. All our partners are experienced professionals who have been background-checked and trained to provide high-quality service."
  },
  {
    id: 4,
    question: "What cities do you operate in?",
    answer: "Currently, we serve select cities across Delhi NCR, and we're expanding regularly. Check our service availability in your area on our app or website."
  },
  {
    id: 5,
    question: "Can I book a service for someone else?",
    answer: "Absolutely, just enter their contact details during booking, and our partner will coordinate with them directly."
  },
  {
    id: 6,
    question: "How are service prices determined?",
    answer: "Prices vary by service type and duration. All pricing details are transparent and shown at the time of booking."
  },
  {
    id: 7,
    question: "How can I pay for the service?",
    answer: "Payments can be made through our app using various options like credit/debit cards, digital wallets, or UPI for seamless transactions. You can also pay in cash after service."
  },
  {
    id: 8,
    question: "What is the cancellation and refund policy?",
    answer: "Terms of cancellation and refund vary by the type of service. Generally, we will provide a 100% refund if you cancel before a professional has been assigned. A nominal fee might be applicable depending on how long before the service you cancel."
  },
  {
    id: 9,
    question: "How do I get support regarding any issues?",
    answer: "For any support, please visit the 'Help & Support' section in the app. Our FAQs will help you with quick answers to any questions or fill out the support form and our team will address your issue promptly."
  },
  {
    id: 10,
    question: "Can I rate my service?",
    answer: "Yes, after every trip, you'll have the option to rate your service and provide feedback through our app."
  },
  {
    id: 11,
    question: "How can I stay updated on new services or offers?",
    answer: "Sign up for our newsletter or follow us on social media to stay informed about new services, discounts, and updates"
  }
];

function FindAnswers() {
  const [openId, setOpenId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const displayedFaqs = showAll ? faqs : faqs.slice(0, 5);

  return (
    <div className="faq-section">
      <div className="nav-container container">
        <h1 className='find-answers'>Find Answers</h1>
        <div className="faq-list">
          {displayedFaqs.map((faq) => (
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

export default FindAnswers;
