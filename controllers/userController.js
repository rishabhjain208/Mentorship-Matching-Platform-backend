const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const { bio, skills, interests } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { bio, skills, interests },
    });

    res.status(200).json({ message: "Profile updated successfully!", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const user = await prisma.user.delete({
      where: { id: req.userId },
    });
    res.status(200).json({ message: "Profile deleted successfully!", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
