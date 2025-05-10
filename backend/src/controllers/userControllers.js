const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getDB } = require("../utils/db");

// 🔐 Login with raw driver
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

    // Exclude password before sending
    const { password: _, ...userWithoutPassword } = foundUser;

    res.status(200).json({
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};


// 📝 Signup with raw driver (updated with password hashing)
exports.userSignUp = async (req, res) => {
  const { firstName, lastName, email, password, imageUrl, role } = req.body;

  try {
    const db = getDB();

    // Check for existing user
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password inside controller
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      imageUrl: imageUrl || null,
      role: role || "user",
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
