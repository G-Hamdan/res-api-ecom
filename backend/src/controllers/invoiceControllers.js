const { getDB } = require("../utils/db");
const { ObjectId } = require("mongodb");

// GET all invoices for the logged-in user
exports.getInvoice = async (req, res) => {
  try {
    const db = getDB();
    const invoices = await db.collection("invoices").find({ user: req.userId }).toArray();
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LEGACY: Create invoice with validation and image upload (from /add route)
exports.addInvoice = async (req, res) => {
  try {
    const db = getDB();
    const { date, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Invoice must contain at least one item." });
    }

    let totalAmount = 0;
    let validItems = [];

    for (const item of items) {
      const query = { productName: item.productName };
      if (item.model) query.model = item.model;

      const product = await db.collection("products").findOne(query);

      if (!product) {
        return res.status(400).json({
          message: `Product '${item.productName}' with model '${item.model}' does not exist.`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for '${item.productName}'. Available: ${product.stock}`
        });
      }

      totalAmount += product.price * item.quantity;

      validItems.push({
        productId: product._id,
        productName: product.productName,
        model: product.model,
        quantity: item.quantity,
        price: product.price
      });

      await db.collection("products").updateOne(
        { _id: product._id },
        { $inc: { stock: -item.quantity } }
      );
    }

    const newInvoice = {
      user: req.userId,
      date: date || new Date(),
      totalAmount,
      items: validItems
    };

    const result = await db.collection("invoices").insertOne(newInvoice);
    res.status(201).json({ ...newInvoice, _id: result.insertedId });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ NEW: Create invoice from cart (used in frontend checkout)
exports.createInvoice = async (req, res) => {
  try {
    const db = getDB();
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Invoice must contain items." });
    }

    const invoice = {
      user: req.userId,
      items,
      total,
      createdAt: new Date()
    };

    const result = await db.collection("invoices").insertOne(invoice);
    res.status(201).json({ ...invoice, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ NEW: Get the most recent invoice for a user
exports.getLatestInvoice = async (req, res) => {
  try {
    const db = getDB();
    const { userId } = req.params;

    const latestInvoice = await db.collection("invoices")
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    if (latestInvoice.length === 0) {
      return res.status(404).json({ message: "No invoices found" });
    }

    res.status(200).json(latestInvoice[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
