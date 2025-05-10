import React from 'react';
import { Link, useNavigate } from "react-router-dom";

const Footer = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);  // Update the state to reflect logout
    navigate('/login');
  };

  return (
    <footer className="py-3 bg-light mt-auto">
      <ul className="nav justify-content-center pb-3">
        {isLoggedIn ? (
          <>
            <li className="nav-item">
              <Link to="/products" className="nav-link px-2">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <button
                onClick={handleLogout}
                className="nav-link px-2 btn btn-link"
                style={{ padding: 0 }}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link to="/login" className="nav-link px-2">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/signup" className="nav-link px-2">
                Sign-up
              </Link>
            </li>
          </>
        )}
      </ul>
    </footer>
  );
};

export default Footer;
