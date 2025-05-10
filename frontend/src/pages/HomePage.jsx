import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Invalid JSON in localStorage for user");
        localStorage.removeItem("user"); // Clear corrupted data
      }
    }
  }, []);

  return (
    <div className="homepage">
      <h1 className="homepage-title">Welcome to Hardcore Gear</h1>
      <p className="homepage-description">
        Tactical exercise gear for the relentless.
      </p>

      {/* Always show these buttons */}
      <div className="auth-buttons">
        <Link to="/login" className="btn btn-secondary">
          Log In
        </Link>
        <Link to="/signup" className="btn btn-secondary">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
