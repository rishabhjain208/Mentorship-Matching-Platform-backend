const express = require("express");
const {
  getProfile,
  updateProfile,
  deleteProfile,
  discoverUsers,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/discover", discoverUsers);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.delete("/profile", authMiddleware, deleteProfile);

module.exports = router;
