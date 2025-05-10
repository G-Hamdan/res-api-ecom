const { getDB } = require("../utils/db");
const { ObjectId } = require("mongodb");

// GET all products
exports.getProduct = async (req, res) => {
  try {
    const db = getDB();
    const products = await db.collection("products").find().toArray();
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET product by ID
exports.getProductById = async (req, res) => {
  const { _id } = req.params;
  try {
    const db = getDB();
    const product = await db.collection("products").findOne({ _id: new ObjectId(_id) });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST new product
exports.addProduct = async (req, res) => {
  const { productName, productDescription, brand, imageUrl, model, stock, price, category } = req.body;

  if (!category) {
    return res.status(400).json({ message: "Category is required" });
  }

  try {
    const db = getDB();
    const newProduct = {
      productName,
      productDescription,
      brand,
      imageUrl,
      model,
      stock,
      price,
      category,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("products").insertOne(newProduct);
    res.status(201).json(result.ops ? result.ops[0] : newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
  const { _id } = req.params;
  try {
    const db = getDB();
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update product
exports.updateProduct = async (req, res) => {
  const { _id } = req.params;
  const { productName, productDescription, brand, imageUrl, model, stock, price, category } = req.body;

  try {
    const db = getDB();
    const result = await db.collection("products").findOneAndUpdate(
      { _id: new ObjectId(_id) },
      {
        $set: {
          productName,
          productDescription,
          brand,
          imageUrl,
          model,
          stock,
          price,
          category,
          updatedAt: new Date()
        }
      },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(result.value);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
