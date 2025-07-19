const jwt = require("jsonwebtoken");// Importing JWT for token verification
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;// Authorization header should be in the format "Bearer token here"

  // Check if token exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token" });
  }

  const token = authHeader.split(" ")[1]; //"Bearer abcd1234.jwt.token" but extract only "abcd1234.jwt.token"

  try {
    const decoded = jwt.verify(token, JWT_SECRET);// Verify the token using the secret key
    req.user = { userId: decoded.userId }; // attach userId to request
    next(); // allow request to continue
  } catch (err) {
    console.error("JWT verify error:", err.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
