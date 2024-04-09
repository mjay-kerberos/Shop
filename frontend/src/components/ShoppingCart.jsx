import React from 'react';
import './ShoppingCart.css'

const ShoppingCart = ({ cartItems, onClose, onCheckout, user, onUserCreditUpdate, setCartItems }) => {
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleCheckout = async () => {
    // Ensure user is not undefined and has username
    if (!user || !user.username) {
      console.error('User information is missing');
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
        throw new Error('Checkout failed');
      }

      const data = await response.json();
      // Call the onUserCreditUpdate function with the new credit amount.
      onUserCreditUpdate(data.updatedCredit);

      onClose(); // Close the cart upon successful checkout.
      alert('Checkout successful, remaining credit: ' + data.updatedCredit);
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <div className="shopping-cart">
      <button onClick={onClose}>Close</button>
      <h2>Your Cart</h2>
      <ul className='items'>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price} x {item.quantity} <button className={'x'} onClick={() => handleRemoveItem(item.id)}>X</button>
          </li>
        ))}
      </ul>
      <p>Total: ${getTotalPrice()}</p>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default ShoppingCart;
