import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchProducts } from '../utils/fetchProducts.js';
import CardComponent from '../components/CardComponent.jsx';
import { FaSignOutAlt } from 'react-icons/fa'; // Import logout icon
import './ProductPage.css';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        if (data) {
          setProducts(data);
        } else {
          setError("No products found.");
        }
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <p className="status-text">Loading...</p>;
  if (error) return <p className="status-text">Error: {error}</p>;
  if (!products.length) return <p className="status-text">No products found</p>;

  return (
    <div className="product-page-container">
      <div className="product-header">
        <Link to="/createproduct" className="create-product-btn">Create Product</Link>
        
        {/* Logout button */}
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <CardComponent
            key={product._id}
            _id={product._id}
            productName={product.productName}
            productDescription={product.productDescription}
            price={product.price}
            imageUrl={product.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
