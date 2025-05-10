require("dotenv").config(); // This loads variables from the .env file into process.env

const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI; // MongoDB URI from environment variables
const dbName = process.env.DB_NAME || "ecommerce"; // Database name from env, fallback to 'ecommerce'

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db; // This will hold our connected database

// Connect to the database
const connectDB = async () => {
  try {
    await client.connect(); // Establish the connection
    db = client.db(dbName); // Use the database name from the environment variable
    console.log("✅ Connected to MongoDB using native driver");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
    throw err; // Let the caller (index.js) handle failure
  }
};

// Get the connected database
const getDB = () => {
  if (!db) {
    throw new Error("❌ DB not connected yet. Call connectDB first.");
  }
  return db;
};

// Export both functions for use in other parts of the application
module.exports = { connectDB, getDB };
