const express = require("express");
const router = express.Router();
const { getProduct, addProduct } = require("../controllers/productControllers.js");
const { verifyAdmin } = require("../middleware/auth"); // Import the new middleware
const upload = require("../middleware/multerConfig");
const sharpMiddleware = require("../middleware/sharpMiddleware");

router.get('/seeProduct', getProduct);

router.post('/addProduct', verifyAdmin, upload.single("image"), sharpMiddleware(), addProduct, (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Error uploading the file. Wrong format?" });
    }

    console.log(req.body); // Logs the form fields
    console.log(req.file); // Logs the uploaded file details
    console.log(req.userId); // From the verifyAdmin middleware

    const fileUrl = req.protocol + "://" + req.get("host") + "/" + req.file.processedPath;
    res.json({ message: "User response reached", fileUrl });
});

module.exports = router;