import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Homepage.jsx';
import Products from './components/ProductsPage.jsx';
import Login from './components/LoginPage.jsx';
import Header from './components/nav/Header.jsx';
import ShoppingCart from './components/ShoppingCart.jsx'; 

function App() {
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  const onLoginSuccess = (userData) => {
    setUser({
      isLoggedIn: true,
      username: userData.username,
      credit: userData.credit,
    });
  };

  // Function to toggle the shopping cart visibility
  const toggleCartVisibility = () => {
    setCartVisible(prev => !prev); // Toggle based on previous state
  };

  // Function to handle adding items to the cart
  const addToCart = (product) => {
    const exist = cartItems.find((item) => item.id === product.id);
    if (exist) {
      // If item already exists in cart, increase the quantity
      setCartItems(cartItems.map((item) =>
        item.id === product.id ? { ...exist, quantity: exist.quantity + 1 } : item
      ));
    } else {
      // Add new item to the cart
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateUserCredit = (newCredit) => {
    setUser((prevUser) => ({ ...prevUser, currentCredit: newCredit }));
  };

  return (
    <div className="App">
      <Header onCartClick={toggleCartVisibility} user={user} />
      {cartVisible && <ShoppingCart cartItems={cartItems} onClose={toggleCartVisibility} onUserCreditUpdate={updateUserCredit} user={user} setCartItems={setCartItems} />} 
      <div className="body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products addToCart={addToCart} />} />
          <Route path="/login" element={<Login onLoginSuccess={onLoginSuccess} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
