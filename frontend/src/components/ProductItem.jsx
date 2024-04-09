import React from 'react';
import './ShoppingCart';
import './ProductItem.css'; // Your CSS file for styling

const ProductItem = ({ product, addToCart }) => {

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
      <div className="product-item">
        <div className="product-image">
          <img src={`/images/${product.image}`} alt={product.name} />
          <div className="product-description">{product.description}</div>
        </div>
        <div className='product-info'>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductItem;



