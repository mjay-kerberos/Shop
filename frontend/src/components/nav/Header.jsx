import React, { useContext } from 'react';
import { Menu } from 'antd';
import { HomeFilled, ProductOutlined, CheckCircleFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Header.css';
import { UserContext } from './App';

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const [current, setCurrent] = useState('home');

  const items = [
    { label: <Link to="/">Home</Link>, key: 'home', icon: <HomeFilled /> },
    { label: <Link to="/products">Products</Link>, key: 'products', icon: <ProductOutlined /> },
    { label: <Link to="/login">Login</Link>, key: 'login', icon: <CheckCircleFilled /> },
    { label: <span onClick={() => setCurrent('cart')}><ShoppingCartOutlined /></span>, key: 'cart', style: { marginLeft: 'auto' } },
  ];

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <div className="header">
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      {user.isLoggedIn && (
        <div className="user-info">
          Hello there, {user.username}! Credits: {user.credit}
        </div>
      )}
    </div>
  );
};

export default Header;