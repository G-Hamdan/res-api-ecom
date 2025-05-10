import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const {
    _id,
    productName,
    productDescription,
    imageUrl,
    price,
    category,
  } = product;

  const handleAddToCart = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?._id || 'guest';

    const cartKey = `cart_${userId}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingItem = existingCart.find(item => item._id === _id);

    let updatedCart;
    if (existingItem) {
      updatedCart = existingCart.map(item =>
        item._id === _id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...existingCart, { ...product, quantity: 1 }];
    }

    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    alert('Added to cart!');
  };

  return (
    <div className="product-card">
      <div
        className="product-image"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <div className="product-info">
        <span className="category-tag">{category}</span>
        <h3>{productName}</h3>
        <p className="price">${price}</p>
        <p className="description">
          {productDescription?.slice(0, 60)}...
        </p>
        <button className="view-button" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
