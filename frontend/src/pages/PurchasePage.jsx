import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PurchasePage.css";

const PurchasePage = () => {
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoice = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        setError("Unauthorized. Please log in.");
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices/latest/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setInvoice(data);
        } else {
          const errData = await res.json();
          setError(errData.message || "Failed to fetch invoice.");
        }
      } catch (err) {
        setError("Something went wrong.");
      }
    };

    fetchInvoice();
  }, []);

  return (
    <div className="receipt-container">
      {error && <p className="error">{error}</p>}
      {invoice ? (
        <div className="receipt">
          <h2>🧾 Purchase Receipt</h2>
          <p><strong>Invoice ID:</strong> {invoice._id}</p>
          <p><strong>Date:</strong> {new Date(invoice.createdAt || invoice.date).toLocaleString()}</p>

          <div className="receipt-items">
            {invoice.items.map((item, index) => (
              <div key={index} className="receipt-item">
                <span>{item.productName}</span>
                <span>{item.quantity} × ${item.price}</span>
              </div>
            ))}
          </div>

          <h3>Total: ${invoice.totalAmount || invoice.total}</h3>
          <button onClick={() => navigate("/")}>Back to Home</button>
        </div>
      ) : !error ? (
        <p>Loading invoice...</p>
      ) : null}
    </div>
  );
};

export default PurchasePage;
