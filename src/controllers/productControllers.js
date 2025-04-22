const { getDB } = require("../utils/db");

exports.getProduct = async (req, res) => {
  try {
    const db = getDB();
    const products = await db.collection("products").find().toArray();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addProduct = async (req, res) => {
  const {
    productName,
    productDescription,
    brand,
    imageUrl,
    model,
    stock,
    price
  } = req.body;

  try {
    const db = getDB();

    const newProduct = {
      productName,
      productDescription,
      brand,
      imageUrl,
      model,
      stock: Number(stock), // Ensure numeric values
      price: Number(price),
      createdAt: new Date()
    };

    const result = await db.collection("products").insertOne(newProduct);
    res.status(201).json({ ...newProduct, _id: result.insertedId });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
