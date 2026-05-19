import React, { FC } from 'react';
import './ErrorPage.scss';

interface ErrorProps {
  onNavigateHome?: () => void;
}

const Error: FC<ErrorProps> = ({ onNavigateHome }) => {
  return (
    <div className="error-page">
      <div className="error-container">
        <div className="logo-section">
          <img 
            src="https://newdeli.com/wp-content/uploads/2024/11/NewDeli_Rebrand_030625_00001-1024x576.jpg" 
            alt="New Deli Logo" 
            className="error-logo"
          />
        </div>
        
        <div className="error-content">
          <div className="error-number">רחל</div>
          <h1 className="error-title">אופס! הדף לא נמצא</h1>
          <p className="error-message">
            נראה שהדף שחיפשת לא קיים או שהוסר.
            <br />
            אל תדאג, אנחנו כאן לעזור לך למצוא את מה שאתה מחפש!
          </p>
          
          <div className="error-actions">
            {onNavigateHome && (
              <button onClick={onNavigateHome} className="home-btn">
                <span className="btn-icon"></span>
                חזרה לדף הבית
                <span className="btn-arrow">←</span>
              </button>
            )}
          </div>
        </div>
        
    </div>
  );
};

export default Error;