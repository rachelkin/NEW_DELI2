import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.scss';

interface AdminPageProps {}

const AdminPage: FC<AdminPageProps> = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>דף מנהל</h1>
        <p>ברוך הבא לפאנל הניהול</p>
      </div>
      
      <div className="admin-content">
        <div className="admin-section">
          <h2>ניהול מוצרים</h2>
          <button onClick={() => navigate('/admin/products',{state:{isAdmin:true}})} className="admin-btn"> רשימת מוצרים</button>
          <button onClick={() => navigate('/admin/add-product')} className="admin-btn">הוסף מוצר </button>
        </div>
        
        <div className="admin-section">
          <h2>ניהול משתמשים</h2>
          <button onClick={() => navigate('/admin/users')} className="admin-btn">רשימת משתמשים</button>
          <button onClick={() => navigate('/admin/add-user')} className="admin-btn">הוסף משתמש</button>
        </div>
        
      </div>
    </div>
  );
};

export default AdminPage;