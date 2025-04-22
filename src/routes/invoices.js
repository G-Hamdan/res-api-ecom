const express = require("express");
const router = express.Router();
const { getInvoice, addInvoice } = require("../controllers/invoiceControllers");
const { verifyToken } = require("../middleware/auth");
const upload = require("../middleware/multerConfig");
const sharpMiddleware = require("../middleware/sharpMiddleware");

router.get("/", verifyToken, getInvoice);

router.post(
  "/add",
  verifyToken,
  upload.single("image"),
  sharpMiddleware(),
  addInvoice
);

module.exports = router;
