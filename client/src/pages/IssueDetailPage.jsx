import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const IssueDetailPage = () => {
  const { issueId } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upvoting, setUpvoting] = useState(false);
  const [upvoteError, setUpvoteError] = useState(null);
  const [resolvedCoords, setResolvedCoords] = useState(null);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await api.get(`/issues/${issueId}`);
        setIssue(response.data);
      } catch (err) {
        setError('Failed to fetch issue details');
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [issueId]);

  // If issue has no coordinates, try to geocode the address to get a map location
  useEffect(() => {
    const geocode = async () => {
      if (!issue || (issue.coordinates && issue.coordinates.length === 2)) return;
      if (!issue.address) return;
      try {
        const q = encodeURIComponent(issue.address);
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`;
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!res.ok) return;
        const data = await res.json();
        if (data && data[0]) {
          setResolvedCoords([parseFloat(data[0].lon), parseFloat(data[0].lat)]);
        }
      } catch (err) {
        // ignore
      }
    };
    geocode();
  }, [issue]);

  const handleUpvote = async () => {
    setUpvoting(true);
    setUpvoteError(null);
    try {
      const response = await api.post(`/issues/${issueId}/upvote`);
      setIssue((prevIssue) => ({
        ...prevIssue,
        upvoteCount: response.data.upvoteCount,
      }));
    } catch (err) {
      setUpvoteError('Failed to toggle upvote. Please try again.');
    } finally {
      setUpvoting(false);
    }
  };

  if (loading) {
    return <p>Loading issue details...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!issue) {
    return <p className="error">Issue not found.</p>;
  }

  return (
    <div className="issue-detail-page">
      <div className="back-link"><Link to="/">← Back to Dashboard</Link></div>

      <div className="issue-detail-card">
        <div className="issue-detail-map">
          {/* If coordinates available, embed an OSM iframe centered on them; otherwise placeholder */}
          {( (issue.coordinates && Array.isArray(issue.coordinates) && issue.coordinates.length === 2) || (resolvedCoords && resolvedCoords.length === 2) ) ? (
            (() => {
              const coords = (issue.coordinates && issue.coordinates.length === 2) ? issue.coordinates : resolvedCoords;
              const lon = coords[0];
              const lat = coords[1];
              // fix marker icon issue by setting a default icon
              const DefaultIcon = L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              });
              L.Marker.prototype.options.icon = DefaultIcon;
              return (
                <MapContainer center={[lat, lon]} zoom={14} style={{ width: '100%', height: '100%' }} zoomControl={false}>
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[lat, lon]} />
                  <ZoomControl position="topright" />
                </MapContainer>
              );
            })()
          ) : (
            <div className="map-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7z" stroke="#99a3ad" strokeWidth="1.2" fill="none" strokeLinejoin="round"/><circle cx="12" cy="9" r="2" fill="#99a3ad"/></svg>
              <div>Issue Location Map</div>
            </div>
          )}
        </div>

        <div className="issue-detail-content">
          <span className={`status-tag status-${issue.status.replace(' ', '')}`}>{issue.status}</span>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <h1 className="issue-title" style={{ margin: 0, flex: 1 }}>{issue.title}</h1>
            {issue.imageUrl && (
              <img src={issue.imageUrl} alt="thumb" className="issue-thumb" />
            )}
          </div>
          <p className="issue-desc">{issue.description}</p>

          <div className="meta">
            <div>
              <div className="meta-label">ADDRESS</div>
              <div className="meta-value">{issue.address}</div>
            </div>
            <div>
              <div className="meta-label">CATEGORY</div>
              <div className="meta-value">{issue.category || 'Other'}</div>
            </div>
          </div>

          <div className="card-divider" />

          <div className="card-footer">
            <div className="upvote-count">Upvotes: {issue.upvoteCount}</div>
            <div>
              <button className="upvote-btn" onClick={handleUpvote} disabled={upvoting}>{upvoting ? 'Updating...' : 'Upvote'}</button>
            </div>
          </div>

          {upvoteError && <p className="error">{upvoteError}</p>}
        </div>
      </div>
    </div>
  );
};

export default IssueDetailPage;
