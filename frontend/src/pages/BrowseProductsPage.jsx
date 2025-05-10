import React, { useContext } from 'react';
import { ProductContext } from '../context/ProductContext';

const BrowseProductsPage = () => {
  const { products } = useContext(ProductContext);

  return (
    <div className="browse-products-page">
      <h1>Browse Products</h1>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-item">
            <h3>{product.title}</h3>
            <p>{product.author}</p>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseProductsPage;
