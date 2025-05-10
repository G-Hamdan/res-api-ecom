// EditProductPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditProductPage = () => {
  const { id } = useParams(); // Get the product id from the URL
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/products/seeProductId/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/api/products/updateProduct/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        alert('Product updated successfully!');
        navigate('/products'); // Redirect to /products after successful update
      } else {
        const error = await response.json();
        alert(`Error updating product: ${error.message}`);
      }
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={product.productName || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="productDescription">Description:</label>
          <textarea
            id="productDescription"
            name="productDescription"
            value={product.productDescription || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="brand">Brand:</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={product.brand || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="model">Model:</label>
          <input
            type="text"
            id="model"
            name="model"
            value={product.model || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={product.stock || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={product.imageUrl || ''}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProductPage;
