import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserList.scss';

interface User {
  id: string;
  fullName: string;
  idNumber: string;
  email: string;
  address: string;
}

interface UserListProps {}

const UserList: FC<UserListProps> = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users');
        console.log('Users loaded:', response.data);
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('שגיאה בטעינת משתמשים:', error);
        setError('שגיאה בטעינת המשתמשים');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="users-page">
        <div className="loading">טוען משתמשים...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <div className="logo-container">
          <img 
            src="https://newdeli.com/wp-content/uploads/2024/11/NewDeli_Rebrand_030625_00001-1024x576.jpg" 
            alt="New Deli Logo" 
            className="header-logo"
          />
        </div>
        <h1 className="page-title">רשימת משתמשים</h1>
        <button onClick={() => navigate('/admin')} className="back-btn">
          חזרה לדף מנהל
        </button>
      </div>

      <div className="users-container">
        <div className="users-stats">
          <div className="stat-card">
            <h3>סה"כ משתמשים</h3>
            <p className="stat-number">{users.length}</p>
          </div>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>שם מלא</th>
                <th>ת.ז</th>
                <th>מייל</th>
                <th>כתובת</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className="user-row">
                  <td className="user-index">{index + 1}</td>
                  <td className="user-name">{user.fullName}</td>
                  <td className="user-id">{user.idNumber}</td>
                  <td className="user-email">{user.email}</td>
                  <td className="user-address">{user.address || 'לא צוין'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;