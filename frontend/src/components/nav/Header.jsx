import React, { useContext, useState } from 'react';
import { Menu } from 'antd';
import { HomeFilled, ProductOutlined, CheckCircleFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Header.css';
import { UserContext } from '../../App';  // Correct the import path as necessary

const Header = ({ onCartClick }) => {
  const { user } = useContext(UserContext);  // Use useContext inside the component
  const [current, setCurrent] = useState('home');
  const items = [
    {
      label: <Link to="/">Home</Link>,
      key: 'home',
      icon: <HomeFilled />,
    },
    {
      label: <Link to="/products">Products</Link>,
      key: 'products',
      icon: <ProductOutlined />,
    },
    {
      label: user && user.isLoggedIn ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link>,  // Conditional label based on user's login status
      key: 'login',
      icon: <CheckCircleFilled />,
    },
    {
      label: <span onClick={onCartClick} style={{ cursor: 'pointer' }}><ShoppingCartOutlined /></span>,  // Make the cart icon clickable
      key: 'cart',
      style: { marginLeft: 'auto' },
    },
  ];

  const onClick = (e) => {
    setCurrent(e.key);  // Update current based on item clicked
  };

  return (
    <div className="header">
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      {user && user.isLoggedIn && (
        <div className="user-info">
          Hello there, {user.username}! Credits: {user.credit}
        </div>
      )}
    </div>
  );
};

export default Header;
