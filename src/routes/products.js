const express = require("express");
const router = express.Router();
const { getProduct, addProduct } = require("../controllers/productControllers");
const { verifyAdmin } = require("../middleware/auth");
const upload = require("../middleware/multerConfig");
const sharpMiddleware = require("../middleware/sharpMiddleware");

// GET all products (public)
router.get("/seeProduct", getProduct);

// POST add product (protected + file upload)
router.post(
    "/addProduct",
    verifyAdmin,
    upload.single("image"),
    sharpMiddleware(),
    addProduct
  );
  

module.exports = router;
