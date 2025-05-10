const express = require("express");
const router = express.Router();
const { getProduct, getProductById, addProduct, deleteProduct, updateProduct } = require("../controllers/productControllers");
const upload = require("../middleware/multerConfig");
const sharpMiddleware = require("../middleware/sharpMiddleware");


router.get('/seeProduct', getProduct);
router.get('/seeProductId/:_id', getProductById);

router.delete('/deleteProduct/:_id', deleteProduct);

router.post('/addProduct', upload.single("image"), sharpMiddleware(), addProduct, (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Error uploading the file. Wrong format?" });
    }

    const fileUrl = req.protocol + "://" + req.get("host") + "/" + req.file.processedPath;
    res.json({ message: "User response reached", fileUrl });
});

router.put('/updateProduct/:_id', updateProduct);

module.exports = router;