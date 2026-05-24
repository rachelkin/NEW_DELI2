import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import HomePage from './components/HomePage/HomePage';
import ProductsPage from './components/ProductsPage/ProductsPage';
import ProductCard from './components/ProductCard/ProductCard';
import ProfilePage from './components/ProfilePage/ProfilePage';
import AdminPage from './components/AdminPage/AdminPage';
import UserList from './components/UserList/UserList';
import ProductList from './components/ProductList/ProductList';
import AddUser from './components/AddUser/AddUser';
import ErrorPage from './components/ErrorPage/ErrorPage';
import ChatBot from './components/Chatbox/Chatbox';
import './App.css';
import AddProduct from './components/AddProductPage/AddProduct';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        <Route path="/home" element={<HomePage />} />
        
        <Route path="/products" element={<ProductsPage />} />
        
        <Route path="/product/:id" element={<ProductCard />} />
        
        <Route path="/ProfilePage" element={<ProfilePage />} />
        
        <Route path="/admin" element={<AdminPage />} />
        
        <Route path="/admin/users" element={<UserList />} />
        
        <Route path="/admin/products" element={<ProductList />} />
        
        <Route path="/admin/add-user" element={<AddUser />} />
        
        <Route path="/admin/add-product" element={<AddProduct />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <ChatBot />
    </Router>
  );
};

export default App;
