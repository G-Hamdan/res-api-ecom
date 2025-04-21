const Product = require("../models/productModels")

exports.getProduct = async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

exports.addProduct = async (req, res) => {
    const { productName, productDescription, brand, imageUrl, model, stock, price } = req.body
    try {
    const newProduct = new Product({
        productName,
        productDescription,
        brand,
        imageUrl,
        model,
        stock,
        price
    })
    const savedProduct = await newProduct.save()
    res.status(201).json(savedProduct)
} catch (err) {
    res.status(400).json({
        message: err.message
    })
}
}