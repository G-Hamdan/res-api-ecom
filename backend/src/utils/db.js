const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

// Create the MongoClient instance
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db; // This will hold our connected database

// Connect to the database
const connectDB = async () => {
  try {
    await client.connect(); // Establish the connection
    db = client.db("ecommerce"); // Use your specific DB name
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

// Export both functions
module.exports = { connectDB, getDB };
