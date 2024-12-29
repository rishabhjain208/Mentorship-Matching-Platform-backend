const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Discover users with filters
exports.discoverUsers = async (req, res) => {
  const { role, skills, interests, search } = req.query;

  try {
    // Build filter criteria
    const filters = {
      ...(role && { role }), // Filter by role
      ...(skills && { skills: { hasSome: skills.split(",") } }), // Filter by skills (comma-separated)
      ...(interests && { interests: { hasSome: interests.split(",") } }), // Filter by interests (comma-separated)
    };

    // Search by name or bio if `search` query is provided
    if (search) {
      filters.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
      ];
    }

    // Query the database
    const users = await prisma.user.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        role: true,
        bio: true,
        skills: true,
        interests: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
