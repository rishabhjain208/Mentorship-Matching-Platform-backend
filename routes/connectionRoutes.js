const express = require("express");
const {
  sendConnectionRequest,
  respondToRequest,
  listConnectionRequests,
  getOngoingConnections,
} = require("../controllers/connectionController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/send", authMiddleware, sendConnectionRequest);
router.post("/respond", authMiddleware, respondToRequest);
router.get("/list", authMiddleware, listConnectionRequests);
router.get("/ongoing", authMiddleware, getOngoingConnections);

module.exports = router;
