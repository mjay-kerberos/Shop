import React, { useEffect, useState } from 'react';
import ProductItem from './ProductItem'; // Assuming you have this component
import './ProductsPage.css'; // Your CSS file for styling

const ProductsPage = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/products') // Adjust the URL as necessary
      .then((response) => {
        if (!response.ok) { // Check if the response was successful
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Check if the data is an array before setting it
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          throw new Error('Data is not an array');
        }
      })
      .catch((error) => {
        console.error("Failed to load products:", error);
        setError(error);
      });
  }, []);

  // Display an error message if there was an error fetching the products
  if (error) {
    return <div className="error">Failed to load products: {error.message}</div>;
  }

  return (
    <div>
    <div className='text'>
        Products
        </div>
    <div className='symbol'>
        Products
    </div>
    <div className="products-container">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} addToCart={addToCart} />
      ))}
    </div>
    </div>
  );
};

export default ProductsPage;
