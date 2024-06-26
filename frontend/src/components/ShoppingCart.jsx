import React, { useContext } from 'react';
import { UserContext } from '../App';  // Ensure correct path
import './ShoppingCart.css';

const ShoppingCart = ({ cartItems, setCartItems, onClose }) => {
  const { user, updateUserCredit } = useContext(UserContext);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleCheckout = async () => {
    if (!user || !user.username) {
      console.error('Checkout failed: User information is missing.');
      alert('Error: User information is missing.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          cartItems: cartItems,
        }),
      });

      if (!response.ok) {
        throw new Error('Checkout failed with HTTP status ' + response.status);
      }

      const data = await response.json();
      updateUserCredit(data.updatedCredit);  // Update credit using context
      setCartItems([]);  // Clear the cart after checkout
      onClose();  // Close the cart modal (assumes onClose toggles visibility)
      alert('Checkout successful! Remaining credit: ' + data.updatedCredit);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed: ' + error.message);
    }
  };

  return (
    <div className="shopping-cart-overlay">
      <div className="shopping-cart">
        <button onClick={onClose}>Close</button>
        <h2>Your Cart</h2>
        <ul className='items'>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price} x {item.quantity}
              <button className='x' onClick={() => handleRemoveItem(item.id)}>X</button>
            </li>
          ))}
        </ul>
        <p>Total: ${getTotalPrice()}</p>
        <button onClick={handleCheckout}>Checkout</button>
      </div>
    </div>
  );
};

export default ShoppingCart;
