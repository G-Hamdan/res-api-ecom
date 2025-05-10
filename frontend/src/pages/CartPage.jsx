import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeItem, updateQuantity } = useCart();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    calculateTotal(cartItems);
  }, [cartItems]);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      alert("Please log in to complete checkout.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems,
          total,
        }),
      });

      if (response.ok) {
        // Clear cart
        const cartKey = `cart_${user._id}`;
        localStorage.removeItem(cartKey);

        // Redirect to invoice confirmation page
        alert("Checkout successful! Proceeding to confirmation.");
      } else {
        const data = await response.json();
        alert("Checkout failed: " + data.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong during checkout.");
    }
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div className="cart-item" key={item._id}>
              <img src={item.imageUrl} alt={item.productName} />
              <div className="cart-info">
                <h3>{item.productName}</h3>
                <p>Category: {item.category}</p>
                <p>${item.price} × {item.quantity}</p>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item._id, item.price, parseInt(e.target.value))}
                />
                <button onClick={() => removeItem(item._id)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h3>Total: ${total.toFixed(2)}</h3>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
