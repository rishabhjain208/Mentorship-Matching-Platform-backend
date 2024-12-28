const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "rishabhJain";

exports.generateToken = (userId) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "15d" });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};
