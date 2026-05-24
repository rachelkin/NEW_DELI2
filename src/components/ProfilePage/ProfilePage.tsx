import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import './ProfilePage.scss';

interface ProfilePageProps {}

const ProfilePage: FC<ProfilePageProps> = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [address, setAddress] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.userId) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/users/${currentUser.userId}`);
        const user = response.data;
        setUserId(user.id);
        setFullName(user.fullName || '');
        setEmail(user.email || '');
        setIdNumber(user.idNumber || '');
        setAddress(user.address || '');
      } catch (error) {
        console.error('שגיאה בטעינת נתוני משתמש:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.patch(`/users/${userId}`, {
        fullName,
        email,
        idNumber,
        address
      });
      
      localStorage.setItem('currentUser', JSON.stringify({
        userId,
        userName: fullName,
        userEmail: email
      }));

      navigate('/home');
    } catch (error) {
      console.error('שגיאה בעדכון פרטים:', error);
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <h1>הפרופיל שלי</h1>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="fullName">שם מלא</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">אימייל</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="idNumber">תעודת זהות</label>
            <input
              type="text"
              id="idNumber"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">כתובת</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-input"
            />
          </div>

          <button type="submit" className="submit-btn">
            עדכן פרטים
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
