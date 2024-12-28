const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwtUtils");
const prisma = new PrismaClient();

exports.sendConnectionRequest = async (req, res) => {
  const { receiverId } = req.body; // Mentor's ID
  const senderId = req.userId; // Mentee's ID from authenticated user
  console.log(receiverId);
  try {
    // Check if the receiver exists
    const mentor = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({ message: "Mentor not found!" });
    }

    // Check if a pending request already exists
    const existingRequest = await prisma.connectionRequest.findFirst({
      where: { senderId, receiverId, status: "pending" },
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent!" });
    }

    // Create a new connection request
    const request = await prisma.connectionRequest.create({
      data: { senderId, receiverId },
    });

    res.status(201).json({ message: "Request sent successfully!", request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.respondToRequest = async (req, res) => {
  const { requestId, status } = req.body; // 'accepted' or 'declined'
  const userId = req.userId; // Authenticated user (mentor)
  console.log("userId " + userId);
  try {
    // Find the request
    const request = await prisma.connectionRequest.findUnique({
      where: { id: requestId },
    });

    console.log("requestId " + request.senderId);

    if (!request || request.senderId !== userId) {
      return res.status(404).json({ message: "Request not found!" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already responded to!" });
    }

    // Update the request status
    const updatedRequest = await prisma.connectionRequest.update({
      where: { id: requestId },
      data: { status },
    });

    res
      .status(200)
      .json({ message: `Request ${status} successfully!`, updatedRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listConnectionRequests = async (req, res) => {
  const userId = req.userId; // Authenticated user

  try {
    // Fetch requests sent by the user
    const sentRequests = await prisma.connectionRequest.findMany({
      where: { senderId: userId },
      include: { receiver: true }, // Include mentor details
    });

    // Fetch requests received by the user
    const receivedRequests = await prisma.connectionRequest.findMany({
      where: { receiverId: userId },
      include: { sender: true }, // Include mentee details
    });

    res.status(200).json({ sentRequests, receivedRequests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOngoingConnections = async (req, res) => {
  const userId = req.userId; // Authenticated user

  try {
    // Fetch accepted requests involving the user
    const connections = await prisma.connectionRequest.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        status: "accepted",
      },
      include: { sender: true, receiver: true },
    });

    res.status(200).json({ connections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
