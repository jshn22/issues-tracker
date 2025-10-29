import React from 'react';
import { Link } from 'react-router-dom';
import ReportIssueForm from '../components/ReportIssueForm';

const ReportIssuePage = () => {
  return (
    <div className="report-page">
      <div className="report-container">
        <div className="report-header">
          <h2>Report New Issue</h2>
        </div>
        <ReportIssueForm />
      </div>
    </div>
  );
};

export default ReportIssuePage;
