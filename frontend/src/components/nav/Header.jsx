import React, { useContext, useState } from 'react';
import { Menu } from 'antd';
import { HomeFilled, ProductOutlined, CheckCircleFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';  // useNavigate is used for programmatic navigation
import './Header.css';
import { UserContext } from './App';  // Ensuring UserContext is imported correctly

const Header = () => {
  const { user } = useContext(UserContext);  // Destructure to use 'user' from context
  const [current, setCurrent] = useState('home');
  const navigate = useNavigate();  // Hook for navigation

  const items = [
    { label: <Link to="/">Home</Link>, key: 'home', icon: <HomeFilled /> },
    { label: <Link to="/products">Products</Link>, key: 'products', icon: <ProductOutlined /> },
    { label: user.isLoggedIn ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link>, key: 'login', icon: <CheckCircleFilled /> },
    { label: (<ShoppingCartOutlined onClick={() => navigate('/cart')} style={{ cursor: 'pointer' }} />), key: 'cart', style: { marginLeft: 'auto' } },
  ];

  const onClick = (e) => {
    setCurrent(e.key);  // This will set the current selected key in state
  };

  return (
    <div className="header">
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      {user.isLoggedIn && (
        <div className="user-info">
          Hello, {user.username}! Credits: {user.credit}
        </div>
      )}
    </div>
  );
};

export default Header;
