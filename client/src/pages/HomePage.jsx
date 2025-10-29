import React, { useState } from 'react';
import IssueList from '../components/IssueList';
import IssueMap from '../components/IssueMap';

const HomePage = () => {
  const [view, setView] = useState('list'); // 'list' or 'map'
  const [filters, setFilters] = useState({ category: '', status: '' });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="homepage-controls">
        <div className="filters">
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            <option value="Pothole">Pothole</option>
            <option value="Streetlight">Streetlight</option>
            <option value="Garbage">Garbage</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Other">Other</option>
          </select>
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <div className="view-toggle">
          <button onClick={() => setView('list')} disabled={view === 'list'} aria-label="Grid view">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="8" height="8" rx="1" stroke="#1f6fd8" strokeWidth="1.5" fill="#eaf4ff"/>
              <rect x="13" y="3" width="8" height="8" rx="1" stroke="#1f6fd8" strokeWidth="1.5" fill="#eaf4ff"/>
              <rect x="3" y="13" width="8" height="8" rx="1" stroke="#1f6fd8" strokeWidth="1.5" fill="#eaf4ff"/>
              <rect x="13" y="13" width="8" height="8" rx="1" stroke="#1f6fd8" strokeWidth="1.5" fill="#eaf4ff"/>
            </svg>
            <span className="view-label">Grid View</span>
          </button>
          <button onClick={() => setView('map')} disabled={view === 'map'} aria-label="Map view">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 6l-6 2-6-2-6 2v11l6-2 6 2 6-2V6z" stroke="#1f6fd8" strokeWidth="1.2" fill="#eaf4ff" strokeLinejoin="round"/>
              <circle cx="12" cy="10" r="1.6" fill="#1f6fd8"/>
            </svg>
            <span className="view-label">Map View</span>
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <IssueList filters={filters} />
      ) : (
        <IssueMap filters={filters} />
      )}
    </div>
  );
};

export default HomePage;
