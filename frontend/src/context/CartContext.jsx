import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState("");

  // Fetch cart from localStorage when the component mounts
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  // Update localStorage whenever the cart is updated
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));  // Save cart to localStorage
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find(
        (item) => item._id === product._id && item.price === product.price
      );

      if (existing) {
        // If item already exists, increase the quantity
        return prevItems.map((item) =>
          item._id === product._id && item.price === product.price
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new product to the cart
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    // Show notification after adding the item
    setNotification(`${product.productName} added to cart!`);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const increaseQuantity = (_id, price) => {
    setCartItems((items) =>
      items.map((item) =>
        item._id === _id && item.price === price
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (_id, price) => {
    setCartItems((items) =>
      items.map((item) =>
        item._id === _id && item.price === price && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const updateQuantity = (_id, price, quantity) => {
    setCartItems((items) =>
      items.map((item) =>
        item._id === _id && item.price === price
          ? { ...item, quantity: quantity }
          : item
      )
    );
  };

  const removeItem = (_id) => {
    setCartItems((items) => items.filter((item) => item._id !== _id));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");  // Remove from localStorage as well
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
        removeItem,  // Exposing removeItem function
        clearCart,
        notification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
