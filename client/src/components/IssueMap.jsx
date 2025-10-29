import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import api from '../services/api';

const IssueMap = ({ filters }) => {
  const [issues, setIssues] = useState([]);
  
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await api.get('/issues', { params: filters });
        setIssues(response.data);
      } catch (err) {
        // fetching issues failed; the component will show no markers
      }
    };
    fetchIssues();
  }, [filters]);

  const validIssues = issues.filter(issue => 
    issue.location && 
    issue.location.coordinates &&
    issue.location.coordinates.length === 2
  );

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {validIssues.map(issue => (
        <Marker key={issue._id} position={[issue.location.coordinates[1], issue.location.coordinates[0]]}>
          <Popup>
            <h4>{issue.title}</h4>
            <p>{issue.category}</p>
            <Link to={`/issue/${issue._id}`}>View Details</Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default IssueMap;
