const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

const connectDB = async () => {
  try {
    await client.connect();
    db = client.db("ecommerce"); // change to your DB name
    console.log("✅ Connected to MongoDB using native driver");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("❌ DB not connected yet. Call connectDB first.");
  }
  return db;
};

module.exports = { connectDB, getDB };
