import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import './ProductsPage.scss';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  purchaseCount?: number;
}

interface ProductsPageProps {}

const ProductsPage: FC<ProductsPageProps> = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchName, setSearchName] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const searchByCategory = async () => {
    if (!selectedCategory) return;
    try {
      const response = await axios.get(`http://localhost:3000/products?category=${selectedCategory}`);
      setProducts(response.data);
    } catch (error) {
      console.error('שגיאה בחיפוש לפי קטגוריה:', error);
    }
  };

  const searchByName = async () => {
    if (!searchName.trim()) return;
    try {
      const response = await axios.get('http://localhost:3000/products');
      const filtered = response.data.filter((product: Product) => 
        product.name.toLowerCase().includes(searchName.toLowerCase())
      );
      setProducts(filtered);
    } catch (error) {
      console.error('שגיאה בחיפוש לפי שם:', error);
    }
  };

  const searchByPrice = async () => {
    try {
      let url = 'http://localhost:3000/products?';
      if (minPrice) url += `price_gte=${minPrice}&`;
      if (maxPrice) url += `price_lte=${maxPrice}`;
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('שגיאה בחיפוש לפי מחיר:', error);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchName('');
    setMinPrice('');
    setMaxPrice('');
    fetchProducts();
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/products');
      setProducts(response.data);
    } catch (error) {
      console.error('שגיאה בטעינת מוצרים:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    setLoading(false);
  }, []);

  const groupProductsByCategory = (products: Product[]) => {
    const categoryOrder = ['מנות עיקריות', 'תוספות ונשנושים', 'סלטים', 'רטבים', 'משקאות'];
    const grouped: { [key: string]: Product[] } = {};
    
    categoryOrder.forEach(category => {
      const categoryProducts = products.filter(product => product.category === category);
      console.log(`קטגוריה ${category}: ${categoryProducts.length} מוצרים`);
      grouped[category] = categoryProducts;
    });
    
    return grouped;
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading">טוען מוצרים...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  const groupedProducts = groupProductsByCategory(products);

  return (
    <div className="products-page">
      <Navbar />
      <div className="products-header">
        <div className="logo-container">
          <img 
            src="https://newdeli.com/wp-content/uploads/2024/11/NewDeli_Rebrand_030625_00001-1024x576.jpg" 
            alt="New Deli Logo" 
            className="header-logo"
          />
        </div>
        <h2 className="page-subtitle">הפינוקים שלנו</h2>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="category-filter">סינון לפי קטגוריה</label>
          <div className="filter-with-btn">
            <select 
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">כל הקטגוריות</option>
              <option value="מנות עיקריות">מנות עיקריות</option>
              <option value="תוספות ונשנושים">תוספות ונשנושים</option>
              <option value="סלטים">סלטים</option>
              <option value="רטבים">רטבים</option>
              <option value="משקאות">משקאות</option>
            </select>
            <button onClick={searchByCategory} className="search-btn">חפש</button>
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="name-filter">חיפוש לפי שם</label>
          <div className="filter-with-btn">
            <input
              type="text"
              id="name-filter"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="הכנס שם מוצר..."
              className="filter-input"
            />
            <button onClick={searchByName} className="search-btn">חפש</button>
          </div>
        </div>

        <div className="filter-group">
          <label>טווח מחירים</label>
          <div className="filter-with-btn">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="מינ"
              className="filter-input price-input"
            />
            <span className="price-separator">-</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="מקס"
              className="filter-input price-input"
            />
            <button onClick={searchByPrice} className="search-btn">חפש</button>
          </div>
        </div>               


        <button onClick={clearFilters} className="clear-filters-btn">נקה הכל</button>
      </div>

      <div className="products-container">
        {Object.entries(groupedProducts).map(([category, categoryProducts]) => {
          if (categoryProducts.length === 0) return null;
          
          return (
            <div key={category} className="category-section">
              <h2 className="category-title">{category}</h2>
              <div className="products-grid">
                {categoryProducts.map((product) => (
                  <button 
                    key={product.id} 
                    className="product-card"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="product-image-container">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/img/placeholder.jpg';
                        }}
                      />
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-price">₪{product.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsPage;
