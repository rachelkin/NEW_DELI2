import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './HomePage.scss';

interface HomePageProps {}

const HomePage: FC<HomePageProps> = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <Navbar />
      <div className="homepage-content">
        <div className="welcome-section">
          <div className="logo-container">
            <img 
              src="https://newdeli.com/wp-content/uploads/2024/11/NewDeli_Rebrand_030625_00001-1024x576.jpg" 
              alt="New Deli Logo" 
              className="homepage-logo"
            />
          </div>
          <h1 className="welcome-title">ברוכים הבאים לחוויית קנייה מהנה בניו דלי</h1>
          <p className="welcome-subtitle">מסעדה בשרית כשרה עם המנות הטעימות ביותר</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
