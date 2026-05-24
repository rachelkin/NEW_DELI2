import React, { FC, useEffect, useState } from 'react';
import { useNavigate,useLocation  } from 'react-router-dom';
import axios from 'axios';
import './ProductList.scss';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

const PLACEHOLDER =
  'https://via.placeholder.com/80/4CAF50/FFFFFF?text=No+Image';

const ProductList: FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const location = useLocation();
  const isAdmin = location.state?.isAdmin === true || window.location.pathname.includes('/admin');


  const getImageUrl = (image?: string) => {
    if (!image) return PLACEHOLDER;

    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }

    return `/img/${image.replace(/^\/?img\/?/, '')}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>('/products');
        setProducts(res.data);
      } catch (e) {
        setError('שגיאה בטעינת המוצרים');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="products-admin-page">
        <div className="loading">טוען מוצרים...</div>
      </div>
    );

  if (error)
    return (
      <div className="products-admin-page">
        <div className="error">{error}</div>
      </div>
    );
const deleteProduct = async (id: string) => {
  setMessage('');
  
  try {
    await axios.delete(`/products/${id}`);
    setProducts(prev => prev.filter(p => p.id !== id));
    setMessage('המוצר נמחק בהצלחה');
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
  } catch {
    setMessage('שגיאה במחיקת המוצר');
    setMessageType('error');
    setTimeout(() => setMessage(''), 3000);
  }
};


  return (
    <div className="products-admin-page">
      <div className="products-admin-header">
        <div className="logo-container">
          <img
            src="https://newdeli.com/wp-content/uploads/2024/11/NewDeli_Rebrand_030625_00001-1024x576.jpg"
            alt="New Deli"
            className="header-logo"
          />
        </div>

        <h1 className="page-title">ניהול מלאי מוצרים</h1>

        <button onClick={() => navigate('/admin')} className="back-btn">
          חזרה לדף מנהל
        </button>
      </div>

      <div className="products-admin-container">
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
        <div className="products-stats">
          <div className="stat-card">
            <h3>סה״כ פריטים</h3>
            <p className="stat-number">{products.length}</p>
          </div>
        </div>

        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>#</th>
                <th>שם מוצר</th>
                <th>קטגוריה</th>
                <th>מחיר</th>
                <th>תמונה</th>
                {isAdmin && <th>פעולות</th>}
              </tr>
            </thead>

            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} className="product-row">
                  <td>{index + 1}</td>

                  <td className="product-name">{product.name}</td>

                  <td>
                    <span className="product-category">
                      {product.category}
                    </span>
                  </td>

                  <td>
                    <span className="product-price">₪{product.price}</span>
                  </td>

                  <td>
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="table-product-img"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PLACEHOLDER;
                      }}
                    />
                  </td>
                  {isAdmin && (
                    <td>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="delete-btn"
                      >
                        מחק
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
