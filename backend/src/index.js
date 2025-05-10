require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 3000;

const userRoutes = require("./routes/users.js");
const productRoutes = require("./routes/products.js");
const invoiceRoutes = require("./routes/invoices.js");
const { connectDB } = require("./utils/db.js");

// MIDDLEWARE
app.use(cors()); // 
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = Date.now();
  req.arithmetical_value = 4 * 7;
  next();
});

// ✅ Ensure DB is connected before registering routes
connectDB().then(() => {
  console.log("✅ DB connection established");

  // ROUTES
  app.use("/api/users", userRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/invoices", invoiceRoutes);

  // Ecommerce home route
  app.get("/", (req, res) => {
    res.send("Welcome to my API! e-commerce backend 🤳");
  });

  // Image folder
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // Start server
  app.listen(port, () => {
    console.log(`🚀 Server listening at http://localhost:${port}`);
  });
}).catch((err) => {
  console.error("❌ Failed to connect to DB. Server not started.", err);
});
