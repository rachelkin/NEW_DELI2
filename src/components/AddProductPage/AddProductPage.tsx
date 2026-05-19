import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddProductPage.scss';

interface ProductForm {
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
}

const AddProductPage: FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    category: '',
    price: '',
    image: '',
    description: ''
  });
  const [errors, setErrors] = useState<Partial<ProductForm>>({});
  const [loading, setLoading] = useState(false);

  const categories = [
    'סנדוויצים',
    'סלטים', 
    'תוספות ונשנושים',
    'רטבים',
    'משקאות'
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductForm> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'שם המוצר חובה';
    }

    if (!formData.category) {
      newErrors.category = 'קטגוריה חובה';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'מחיר חובה';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'מחיר חייב להיות מספר חיובי';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'תמונה חובה';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'תיאור חובה';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post('http://localhost:3000/products', {
        ...formData,
        price: Number(formData.price),
        id: Date.now()
      });
      
      alert('המוצר נוסף בהצלחה!');
      navigate('/admin/products');
    } catch (error) {
      alert('שגיאה בהוספת המוצר');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ProductForm]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-header">
        <div className="logo-container">
          <img 
            src="https://newdeli.com/wp-content/uploads/2024/11/NewDeli_Rebrand_030625_00001-1024x576.jpg" 
            alt="New Deli" 
            className="header-logo" 
          />
        </div>
        <h1 className="page-title">הוספת מוצר חדש</h1>
        <button onClick={() => navigate('/admin')} className="back-btn">חזרה לדף מנהל</button>
      </div>

      <div className="add-product-container">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">שם המוצר *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="הכנס שם מוצר"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">קטגוריה *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
            >
              <option value="">בחר קטגוריה</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="price">מחיר *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? 'error' : ''}
              placeholder="הכנס מחיר"
              min="0"
              step="0.01"
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="image">שם קובץ תמונה *</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className={errors.image ? 'error' : ''}
              placeholder="לדוגמה: סלט-עוף.jpg"
            />
            {errors.image && <span className="error-message">{errors.image}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">תיאור המוצר *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
              placeholder="הכנס תיאור מפורט של המוצר"
              rows={4}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'מוסיף מוצר...' : 'הוסף מוצר'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;