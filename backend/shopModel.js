const Pool = require('pg').Pool
const bcrypt = require('bcryptjs');
const pool = new Pool({
  user: 'shop_admin',
  host: 'localhost',
  database: 'shop_db',
  password: 'secure_password',
  port: 5432,
});

// Products
const getProducts = async () => {
  const query = "SELECT * FROM products";
  return await pool.query(query).then(res => res.rows);
};

// Users & Authentication
const getUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = $1';
  const values = [username]; // Ensure username is passed as an array
  try {
    const res = await pool.query(query, values);
    return res.rows[0]; // Return the first user found
  } catch (err) {
    console.error(err.stack);
    throw new Error('Error fetching user from database');
  }
};

const login = async (username, password) => {
  try {
    const user = await getUserByUsername(username);
    if (user && user.password === password) {
      return user; // Login success
    } else {
      throw new Error('Invalid credentials'); // Login failure
    }
  } catch (error) {
    throw error; // Propagate error
  }
};


// Purchases
const recordPurchases = async (username, cartItems) => {
  // Use a transaction to ensure data consistency
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Record each purchase
    for (const item of cartItems) {
      const purchaseQuery = 'INSERT INTO purchases (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
      await client.query(purchaseQuery, [username, item.product_id, item.quantity]);
    }
    
    // Update credits
    const cost = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const creditsQuery = 'UPDATE team_credits SET current_credit = current_credit - $1 WHERE username = $2 RETURNING *';
    const updatedCredits = await client.query(creditsQuery, [cost, username]);
    
    await client.query('COMMIT');
    return updatedCredits.rows[0]; // return updated credit info
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Inventory
const getInventory = async () => {
  const query = 'SELECT * FROM inventory';
  return await pool.query(query).then(res => res.rows);
};

// Team Credits
const getTeamCredits = async (username) => {
  const query = 'SELECT * FROM team_credits WHERE username = $1';
  return await pool.query(query, [username]).then(res => res.rows[0]);
};

const handleCheckout = async (username, cartItems) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const userCreditResult = await client.query(
      'SELECT current_credit FROM team_credits WHERE username = $1', [username]
    );
    const userCredits = userCreditResult.rows[0].current_credit;

    const totalCost = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    if (userCredits >= totalCost) {
      const updatedCredit = userCredits - totalCost;

      await client.query(
        'UPDATE team_credits SET current_credit = $1 WHERE username = $2',
        [updatedCredit, username]
      );

      for (const item of cartItems) {
        await client.query(
          'INSERT INTO purchases (user_id, product_id, quantity) VALUES ($1, $2, $3)',
          [username, item.id, item.quantity]
        );
      }

      await client.query('COMMIT');
      client.release();
      return updatedCredit;
    } else {
      throw new Error('Insufficient credits');
    }
  } catch (error) {
    await client.query('ROLLBACK');
    client.release();
    throw error;
  }
};

module.exports = {
  getProducts,
  getUserByUsername,
  login,
  recordPurchases,
  getInventory,
  getTeamCredits,
  handleCheckout
};