const express = require("express");
const router = express.Router();
const { getInvoice, addInvoice, createInvoice, getLatestInvoice } = require("../controllers/invoiceControllers");
const { verifyToken } = require("../middleware/auth");
const upload = require("../middleware/multerConfig");
const sharpMiddleware = require("../middleware/sharpMiddleware");


// Legacy route (with image)
router.post(
  "/add",
  verifyToken,
  upload.single("image"),
  sharpMiddleware(),
  addInvoice
);

// GET all invoices for the logged-in user
router.get("/", verifyToken, getInvoice);

// ✅ New route for frontend checkout
router.post("/", verifyToken, createInvoice); // expects { userId, items, total }

// ✅ New route to get most recent invoice
router.get("/latest/:userId", verifyToken, getLatestInvoice);

module.exports = router;
