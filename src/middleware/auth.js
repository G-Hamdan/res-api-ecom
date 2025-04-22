const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { getDB } = require("../utils/db");

// ✅ Common function to get user from token
async function getUserFromToken(req, res) {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    return { error: { status: 403, message: "No token provided!" } };
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    req.userId = decoded.userId;

    const db = getDB();
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.userId) });

    if (!user) {
      return { error: { status: 404, message: "User not found!" } };
    }

    return { user };
  } catch (err) {
    return { error: { status: 401, message: "Unauthorized!", detail: err.message } };
  }
}

// ✅ Middleware: verifyToken (any user)
exports.verifyToken = async (req, res, next) => {
  const { user, error } = await getUserFromToken(req, res);
  if (error) return res.status(error.status).json({ message: error.message });
  next();
};

// ✅ Middleware: verifyAdmin (must be admin)
exports.verifyAdmin = async (req, res, next) => {
  const { user, error } = await getUserFromToken(req, res);
  if (error) return res.status(error.status).json({ message: error.message });

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only!" });
  }

  req.userRole = user.role;
  next();
};

// ✅ Middleware: verifyUser (alias for token validation)
exports.verifyUser = async (req, res, next) => {
  const { user, error } = await getUserFromToken(req, res);
  if (error) return res.status(error.status).json({ message: error.message });
  next();
};
