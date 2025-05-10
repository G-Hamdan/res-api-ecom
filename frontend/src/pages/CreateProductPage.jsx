import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateProductPage.css';

const CreateProductPage = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [model, setModel] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Protein');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      productName,
      productDescription,
      brand,
      imageUrl,
      model,
      stock: parseInt(stock),
      price: parseFloat(price),
      category,
    };

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL;

      if (!apiBase) {
        throw new Error("VITE_API_BASE_URL is not defined in your .env");
      }

      const response = await fetch(`${apiBase}/api/products/addProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Product added successfully:', data);
        navigate('/products');
      } else {
        const text = await response.text();
        try {
          const json = JSON.parse(text);
          setError(`Error adding product: ${json.message}`);
        } catch {
          setError(`Error adding product: ${text || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error adding product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="form-container">
      <h2>Create New Product</h2>

      <button onClick={handleGoBack} className="back-button">
        ← Go Back
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="product-form">
        <input type="text" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} required />
        <textarea placeholder="Description" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} required />
        <input type="text" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
        <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
        <input type="text" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} required />
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="Protein">Protein</option>
          <option value="Clothing">Clothing</option>
          <option value="Accessories">Accessories</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default CreateProductPage;
