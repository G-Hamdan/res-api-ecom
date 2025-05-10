import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import Header from "./components/Header"; 
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage"; 
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import ProductPage from "./pages/ProductPage";
import CartPage from './pages/CartPage';
import NotFoundPage from "./pages/NotFoundPage";
import CreateProduct from "./pages/CreateProductPage";
import EditProductPage from './pages/EditProductPage';
import { useState, useEffect } from "react";
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <CartProvider>
      <ProductProvider>
        <div className="app-wrapper">
          <Router>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <main className="app-content">
              <Routes>
                <Route path="/" element={<HomePage setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/login" element={<LogInPage setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/cart" element={isLoggedIn ? <CartPage /> : <LogInPage setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/editproduct/:id" element={<EditProductPage />} />
                
                {/* Protected routes */}
                <Route path="/products" element={isLoggedIn ? <ProductPage /> : <LogInPage setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/createproduct" element={isLoggedIn ? <CreateProduct /> : <LogInPage setIsLoggedIn={setIsLoggedIn} />} />

                {/* 404 Page */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </Router>
        </div>
      </ProductProvider>
    </CartProvider>
  );
};

export default App;
