const express = require("express");
const router = express.Router();
const { hashPassword } = require("../middleware/passencrypt");
const { userLogin, userSignUp } = require("../controllers/userControllers");
const { verifyToken } = require("../middleware/auth");
const { getDB } = require("../utils/db");
const upload = require("../middleware/multerConfig");
const sharpMiddleware = require("../middleware/sharpMiddleware");
const { ObjectId } = require("mongodb"); // For MongoDB query handling

// Get all users (for testing or admin purposes)
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection("users").find({}).toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

// Log in route
router.post("/login", userLogin);

// Sign up route
router.post("/signup", hashPassword, userSignUp);

// Test route to check the user ID after token verification
router.post("/test", verifyToken, (req, res) => {
  console.log(req.userId); // Logs the user ID from the token
  res.send("Test");
});

// Update user route (protected by verifyToken)
router.put("/userUpdate", verifyToken, upload.single("image"), sharpMiddleware(), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Error uploading the file. Wrong format?" });
  }

  try {
    console.log(req.body); // Logs form fields
    console.log(req.file); // Logs uploaded file details
    console.log(req.userId); // Logs userId from the verifyToken middleware

    const fileUrl = req.protocol + "://" + req.get("host") + "/" + req.file.processedPath;

    // Update user data in the database
    const db = getDB();
    const updateResult = await db.collection("users").updateOne(
      { _id: new ObjectId(req.userId) },
      { $set: { ...req.body, imageUrl: fileUrl } } // Assuming 'imageUrl' is added to user data
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ message: "User not found or no changes made" });
    }

    res.json({ message: "User data updated successfully", fileUrl });
  } catch (err) {
    res.status(500).json({ message: "Error updating user data", error: err.message });
  }
});

// Get the current user's data (protected by verifyToken)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.userId) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send back the user details excluding the password
    const { password, ...userData } = user;
    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user data", error: err.message });
  }
});

module.exports = router;
