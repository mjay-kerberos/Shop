import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Homepage.jsx';
import Products from './components/ProductsPage.jsx';
import Login from './components/LoginPage.jsx';
import Header from './components/nav/Header.jsx';
import ShoppingCart from './components/ShoppingCart.jsx';

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState({
    isLoggedIn: false,
    username: '',
    credit: 0,
  });

  const [cartItems, setCartItems] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);

  const onLoginSuccess = (userData) => {
    setUser({
      isLoggedIn: true,
      username: userData.username,
      credit: userData.credit,
    });
  };

  const updateUserCredit = (newCredit) => {
    setUser(current => ({ ...current, credit: newCredit }));
  };

  const toggleCartVisibility = () => {
    setCartVisible(prev => !prev);
  };

  const addToCart = (product) => {
    const exist = cartItems.find((item) => item.id === product.id);
    if (exist) {
      setCartItems(cartItems.map((item) =>
        item.id === product.id ? { ...exist, quantity: exist.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUserCredit }}>
      <Router>
        <div className="App">
          <Header onCartClick={toggleCartVisibility} />
          {cartVisible && (
            <ShoppingCart 
              cartItems={cartItems} 
              onClose={toggleCartVisibility} 
              onUserCreditUpdate={updateUserCredit} 
              user={user} 
              setCartItems={setCartItems} 
            />
          )}
          <div className="body">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products addToCart={addToCart} />} />
              <Route path="/login" element={<Login onLoginSuccess={onLoginSuccess} />} />
              <Route path="/cart" element={<ShoppingCart cartItems={cartItems} setCartItems={setCartItems} onUserCreditUpdate={updateUserCredit} />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
