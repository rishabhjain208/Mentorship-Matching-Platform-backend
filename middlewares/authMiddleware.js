const jwt = require("../utils/jwtUtils");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};
