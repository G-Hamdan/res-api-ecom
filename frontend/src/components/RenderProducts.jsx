import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, addToCart }) => {
  return (
    <div id="app" className="row row-cols-1 row-cols-md-3 g-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          addToCart={addToCart}
        />
      ))}
    </div>
  );
};

export default ProductList;
