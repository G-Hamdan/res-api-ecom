const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./utils/db"); // Import the connectDB function

const app = express();
const port = process.env.PORT || 3000;

// Ensure DB is connected before starting the server
connectDB().then(() => {
  console.log("✅ DB connection established");

  // Middleware and Routes setup
  app.use(cors());
  app.use(express.json());

  // Define your routes here (e.g., userRoutes, productRoutes, etc.)

  // Start the server
  app.listen(port, () => {
    console.log(`🚀 Server listening at http://localhost:${port}`);
  });
}).catch((err) => {
  console.error("❌ Failed to connect to DB. Server not started.", err);
});
