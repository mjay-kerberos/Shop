import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // This is correctly declared to handle error messages

  const handleLogin = async (e) => {
    e.preventDefault();

    setError(''); // Clear previous errors before a new login attempt
    fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Incorrect username or password.');
      }
      return response.json();
    })
    .then(data => {
      console.log("Login response data:", data); // Debugging line
      if (data.username && data.credit !== undefined) {
        onLoginSuccess({
          isLoggedIn: true,
          username: data.username,
          credit: data.credit,
        });
      } else {
        console.error("Unexpected data structure:", data);
        throw new Error('Login failed. Please try again.');
      }
    })
    .catch(error => {
      setError(error.message);
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="login-error">{error}</p>} {/* Error message will only appear if there's an error */}
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;


