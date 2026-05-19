import React, { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductCard.scss';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  purchaseCount?: number;
}

interface Review {
  id: string;
  userId: number;
  userName: string;
  userEmail: string;
  productId: number;
  productName: string;
  rating: number;
  comment: string;
}

const ProductCard: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuestion, setShowQuestion] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const [showAddReview, setShowAddReview] = useState(false);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://via.placeholder.com/400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/img/')) return imagePath;
    if (imagePath.startsWith('img/')) return `/${imagePath}`;
    return `/img/${imagePath}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        setError('שגיאה בטעינת המוצר');
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/reviews?productId=${id}`);
        setReviews(response.data);
      } catch (error) {
        console.error('שגיאה בטעינת חוות דעת:', error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleWantProduct = async (wantIt: boolean) => {
    if (!wantIt) {
      setShowQuestion(false);
      return;
    }

    try {
      const newCount = (product?.purchaseCount || 0) + 1;
      await axios.patch(`http://localhost:3000/products/${id}`, {
        purchaseCount: newCount
      });
      setProduct(prev => prev ? { ...prev, purchaseCount: newCount } : null);
      setShowQuestion(false);
    } catch (error) {
      console.error('שגיאה בעדכון כמות הקניות:', error);
    }
  };

  const handleAddReview = async () => {
    if (!newReview.trim()) return;

    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!user.userId) return;

    try {
      const review = {
        id: Math.random().toString(16).slice(2, 6),
        userId: user.userId,
        userName: user.userName,
        userEmail: user.userEmail,
        productId: Number(id),
        productName: product?.name || '',
        rating: 5,
        comment: newReview
      };

      const response = await axios.post('http://localhost:3000/reviews', review);
      setReviews([...reviews, response.data]);
      setNewReview('');
      setShowAddReview(false);
    } catch (error) {
      console.error('שגיאה בהוספת חוות דעת:', error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await axios.delete(`http://localhost:3000/reviews/${reviewId}`);
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (error) {
      console.error('שגיאה במחיקת חוות דעת:', error);
    }
  };


  if (loading) return <div className="product-card-page"><div className="loading">טוען מוצר...</div></div>;
  if (error) return <div className="product-card-page"><div className="error">{error}</div></div>;
  if (!product) return <div className="product-card-page"><div className="error">מוצר לא נמצא</div></div>;

  return (
    <div className="product-card-page">
      <div className="product-card-header">
        <div className="logo-container">
          <img 
            src="https://newdeli.com/wp-content/uploads/2024/11/NewDeli_Rebrand_030625_00001-1024x576.jpg" 
            alt="New Deli" 
            className="header-logo" 
          />
        </div>
        <button onClick={() => navigate('/products')} className="back-btn">חזרה למוצרים</button>
      </div>

      <div className="product-card-container">
        <h1 className="product-title-main">{product.name}</h1>
        
        <div className="product-card-content">
          <img 
            src={getImageUrl(product.image)} 
            alt={product.name}
            className="product-main-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=No+Image';
            }}
          />

          <div className="product-details-section">
            <div className="product-info-row">
              <span className="product-category">{product.category}</span>
              <span className="product-price">₪{product.price}</span>
            </div>
            
            <p className="product-description">{product.description}</p>
            
            <div className="purchase-count-display">
              <span className="count-label">כמות קניות:</span>
              <span className="count-value">{product.purchaseCount || 0}</span>
            </div>

            {showQuestion && (
              <div className="want-product-section">
                <h3 className="question">האם אתה רוצה את המוצר הזה?</h3>
                <div className="answer-buttons">
                  <button onClick={() => handleWantProduct(true)} className="btn-yes">כן</button>
                  <button onClick={() => handleWantProduct(false)} className="btn-no">לא</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="reviews-section">
            <h2 className="reviews-title">חוות דעת על המוצר</h2>
            
            <div className="reviews-list">
              {reviews.map((review) => {
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                return (
                  <div key={review.id} className="review-card">
                    <div className="review-header-row">
                      <div className="reviewer-info">
                        <span className="reviewer-name">{review.userName}</span>
                        <span className="reviewer-email">{review.userEmail}</span>
                      </div>
                      {currentUser.userId === review.userId && (
                        <button 
                          onClick={() => handleDeleteReview(review.id)} 
                          className="delete-review-btn"
                        >
                          מחק
                        </button>
                      )}
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="reviews-section">
          {!showAddReview ? (
            <button onClick={() => setShowAddReview(true)} className="add-review-btn">
              הוסף חוות דעת
            </button>
          ) : (
            <div className="add-review-form">
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="כתוב את חוות הדעת שלך..."
                className="review-textarea"
                rows={4}
              />
              <div className="review-form-buttons">
                <button onClick={handleAddReview} className="submit-review-btn">שלח</button>
                <button onClick={() => { setShowAddReview(false); setNewReview(''); }} className="cancel-review-btn">ביטול</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
