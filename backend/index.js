const express = require('express');
const shopModel = require('./shopModel'); // Updated to use the new model functions
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// List all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await shopModel.getProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});


// User registration (for simplicity, assuming plaintext passwords are sent)
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
      const newUser = await shopModel.createUser(username, password);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create user' });
    }
  });
  
// User login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await shopModel.getUserByUsername(username);
    if (user && user.password === password) {
      const creditInfo = await shopModel.getTeamCredits(username); // Assuming this function fetches user's credit
      res.json({
        message: 'Login successful', 
        username: username, 
        credit: creditInfo.current_credit 
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Record a purchase
app.post('/api/purchase', async (req, res) => {
  const { username, cartItems } = req.body; // Get username and cart items from request
  try {
    // Loop through cart items and update inventory and credits accordingly
    // Let's assume you have a function in shopModel to handle the inventory and credit updates
    await shopModel.recordPurchase(username, cartItems);
    const updatedCreditInfo = await shopModel.getTeamCredits(username); // Fetch updated credit info after purchase
    res.json({ message: 'Purchase successful', updatedCredit: updatedCreditInfo.current_credit });
  } catch (error) {
    res.status(500).json({ message: 'Failed to record purchase', error: error.message });
  }
});

// CHeckout
app.post('/api/checkout', async (req, res) => {
  const { username, cartItems } = req.body;
  try {
    const updatedCredit = await shopModel.handleCheckout(username, cartItems);
    res.json({ message: 'Checkout successful', updatedCredit });
  } catch (error) {
    console.error('Checkout error:', error.message);
    res.status(500).json({ message: 'Checkout failed', error: error.message });
  }
});

  
// List inventory
app.get('/api/inventory', async (req, res) => {
    try {
      const inventory = await shopModel.getInventory();
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch inventory' });
    }
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  