const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getDB } = require("../utils/db");

// Login with raw driver
exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = getDB();

    const foundUser = await db.collection("users").findOne({ email });
    if (!foundUser) {
      throw new Error("Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: foundUser._id },
      process.env.SECRET_TOKEN_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json(token);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// Signup with raw driver
exports.userSignUp = async (req, res) => {
  const { firstName, email, lastName, imageUrl, role } = req.body;
  const hashedPassword = req.hashedPassword;

  try {
    const db = getDB();

    // Check for existing user
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      imageUrl,
      role,
      inventory: [],
    };

    await db.collection("users").insertOne(newUser);

    res.status(201).json({
      firstName: newUser.firstName,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
