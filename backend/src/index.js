require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./utils/db"); // Import the connectDB function
const app = express();
const port = process.env.PORT || 3000;

// Ensure DB is connected before starting the server
connectDB().then(() => {
  console.log("✅ DB connection established");

  // Middleware for CORS and JSON parsing
  app.use(cors({
    origin: "https://hardcoregear.netlify.app", // Allowing requests from the frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow Content-Type and Authorization headers
  }));
  app.use(express.json());

  // Middleware to set the current time and a custom property
  app.use((req, res, next) => {
    req.requestTime = Date.now();
    req.arithmetical_value = 4 * 7;
    next();
  });

  // Routes
  const userRoutes = require("./routes/users.js");
  const productRoutes = require("./routes/products.js");
  const invoiceRoutes = require("./routes/invoices.js");

  app.use("/api/users", userRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/invoices", invoiceRoutes);

  // Ecommerce home route
  app.get("/", (req, res) => {
    res.send("Welcome to my API! e-commerce backend 🤳");
  });

  // Static folder for uploaded images
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // Start server
  app.listen(port, () => {
    console.log(`🚀 Server listening at http://localhost:${port}`);
  });
}).catch((err) => {
  console.error("❌ Failed to connect to DB. Server not started.", err);
});
