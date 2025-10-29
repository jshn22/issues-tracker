import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const IssueList = ({ filters }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [upvotingIds, setUpvotingIds] = useState(new Set());

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const response = await api.get('/issues', { params: filters });
        setIssues(response.data);
      } catch (err) {
        setError('Failed to fetch issues');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [filters]);

  if (loading) return <p>Loading issues...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="issue-list">
      {issues.length === 0 ? (
        <p>No issues match the current filters.</p>
      ) : (
        issues.map((issue) => (
          <div key={issue._id} className="issue-card">
            <Link to={`/issue/${issue._id}`}>
              <div className="issue-card-image">
                <img src={issue.imageUrl || 'https://via.placeholder.com/300x200.png?text=Image+Placeholder'} alt={issue.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Link>
            <div className="issue-card-content">
              <h3>
                <Link to={`/issue/${issue._id}`}>{issue.title}</Link>
              </h3>
              <div>
                <span className="status-tag-small">{issue.status}</span>
              </div>
              <div className="card-divider" />
              <div className="card-footer">
                <div className="upvote-count">Upvotes: {issue.upvoteCount}</div>
                <div>
                  {user ? (
                    <button
                      className="upvote-btn"
                      onClick={async () => {
                        if (upvotingIds.has(issue._id)) return;
                        setUpvotingIds(new Set(upvotingIds).add(issue._id));
                        try {
                          const res = await api.post(`/issues/${issue._id}/upvote`);
                          setIssues((prev) => prev.map(i => i._id === issue._id ? { ...i, upvoteCount: res.data.upvoteCount } : i));
                        } catch (err) {
                          // ignore errors for now
                        } finally {
                          const s = new Set(upvotingIds);
                          s.delete(issue._id);
                          setUpvotingIds(s);
                        }
                      }}
                      disabled={upvotingIds.has(issue._id)}
                    >
                      {upvotingIds.has(issue._id) ? '...' : 'Upvote'}
                    </button>
                  ) : (
                    <Link to="/login">Login to upvote</Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default IssueList;
