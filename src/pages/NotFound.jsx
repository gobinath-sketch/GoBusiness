import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="not-found-page-container">
      <div className="not-found-card">
        <div className="not-found-icon-wrapper">
          <HelpCircle className="not-found-icon" />
        </div>
        <h1 className="not-found-title">404</h1>
        <p className="not-found-subtitle">Page not found</p>
        <p className="not-found-description">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="not-found-back-btn">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
