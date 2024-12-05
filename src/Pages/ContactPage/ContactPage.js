import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    city: '',
    message: ''
  });

  const [expandedSection, setExpandedSection] = useState('a');

  const faqSections = {
    a: {
      title: 'A. Booking process related faqs',
      items: [
        'Why cant I complete my booking?',
        'What should I do if no partner is assigned to my booking?',
        'How do I know my booking is confirmed?'
      ]
    },
    b: {
      title: 'B. Payment related faqs',
      items: [
        'What payment methods are accepted?',
        'Is advance payment required?',
        'How do I get a refund?'
      ]
    },
    c: {
      title: 'C. Refund and cancellation faqs',
      items: [
        'What is the cancellation policy?',
        'How long does refund take?',
        'Can I reschedule my booking?'
      ]
    },
    d: {
      title: 'D. Safety issues faqs',
      items: [
        'Are the service providers verified?',
        'What safety measures are in place?',
        'How do I report an issue?'
      ]
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <div className="container nav-container contact-page">
        <div className="content-wrapper">
          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <div className="contact-form">
              <h2 className='contact-title'>Get In Touch</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group mobile-input">
                  <span className="country-code">+91</span>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">City</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="delhi">Delhi</option>
                    <option value="bangalore">Bangalore</option>
                  </select>
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  Send Now
                </button>
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="faq-wrapper">
            <div className="faq-section">
              <h2>
                <span className="back-arrow">‹</span>
                How Can We Help You?
              </h2>
              {Object.entries(faqSections).map(([key, section]) => (
                <div key={key} className="faq-category">
                  <button
                    className="category-header"
                    onClick={() => setExpandedSection(expandedSection === key ? '' : key)}
                  >
                    <span>{section.title}</span>
                    {expandedSection === key ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  <div className={`category-content ${expandedSection === key ? 'expanded' : ''}`}>
                    {section.items.map((item, index) => (
                      <div key={index} className="faq-item-contact">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}

export default ContactPage;

