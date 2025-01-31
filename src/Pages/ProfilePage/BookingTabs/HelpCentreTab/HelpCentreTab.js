import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Calendar } from 'lucide-react';
import './HelpCentreTab.css';

const HelpCentreTab = () => {
  const location = useLocation();
  const bookingId = location.state?.bookingId || null; // Retrieve bookingId

  const [query, setQuery] = useState('');
  const [queries, setQueries] = useState([
    { id: 1, query: 'How to reset my password?', status: 'Completed', createddate: 'Dec 25', updateddate: 'Jan 25' },
    { id: 2, query: 'I need help with my account settings.', status: 'Pending', createddate: 'Dec 26', updateddate: 'Jan 27' },
    { id: 3, query: 'Unable to access my documents', status: 'Closed', createddate: 'Dec 27', updateddate: 'Jan 29' }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim() && bookingId) {
      const payload = { booking_id: bookingId, description: query };

      try {
        const response = await axios.post('/api/customer/help_center/add', payload, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200) {
          const newQuery = {
            id: queries.length + 1,
            query,
            status: 'Pending',
            createddate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            updateddate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          };
          setQueries([...queries, newQuery]);
          setQuery('');
        }
      } catch (error) {
        console.error('Error submitting query:', error);
      }
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
          />
        </div>
        <button type="submit" className="submit-button">Submit Query</button>
      </form>

      <h2 className="section-title">Previous Queries</h2>
      <div className="cards-grid">
        {queries.map((item) => (
          <div key={item.id} className="card-helpcentre">
            <div className="card-header">
              <h3 className="card-date">Created Date: {item.createddate}</h3>
              <div className="card-time">
                <Calendar className="calendar-icon" />
                Updated Date: {item.updateddate}
              </div>
            </div>
            <div className="card-content">
              <p className="query-text">{item.query}</p>
              <span className={`status-badge ${item.status.toLowerCase()}`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpCentreTab;
