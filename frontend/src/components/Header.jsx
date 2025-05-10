import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Fetch user data if token exists
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((userData) => {
          setUser(userData);

          const cartKey = `cart_${userData._id}`;
          const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
          const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(totalItems);
        })
        .catch((err) => {
          console.error('Failed to fetch user:', err);
          setUser(null); // In case of error, reset user state
        });
    }
  }, []);

  return (
    <header className="header">
      <div className="logo">
        HARDCORE <span>GEAR</span>
      </div>
      <nav className="nav-links">
        <Link to="/">
          <FaHome /> Home
        </Link>

        {/* Always show the Cart icon */}
        <Link to="/cart" className="cart-icon">
          <FaShoppingCart />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </nav>
    </header>
  );
};

export default Header;
