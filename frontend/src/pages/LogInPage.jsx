import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogInPage.css';

const LogInPage = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://res-api-ecom.onrender.com/api/users/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", user.token); // Store token if available

        // Update login state and redirect to /products
        setIsLoggedIn(true);
        navigate("/products");
      } else {
        setError('Invalid credentials!');
      }
    } catch (err) {
      setError('Error logging in, please try again.');
    }
  };

  return (
    <div className="login-page-container">
      <form onSubmit={handleSubmit} className="login-form-wrapper">
        <h1>Log In</h1>
        {error && <div className="alert-danger">{error}</div>}
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary">
          Log In
        </button>
        <div className="text-center">
          Don't have an account? <a href="/signup">Create one</a>
        </div>
      </form>
    </div>
  );
};

export default LogInPage;
