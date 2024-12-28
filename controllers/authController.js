// const prisma = require("../prismaClient"); // Import the Prisma client
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwtUtils");
const prisma = new PrismaClient();
// Register a new user
exports.register = async (req, res) => {
  const { email, password, name, role, bio, skills, interests } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        bio,
        skills: typeof skills === "string" ? [skills] : skills, // Convert to array if it's a string
        interests: typeof interests === "string" ? [interests] : interests, // Convert to array if it's a string
      },
    });

    const AlreadyUser = await prisma.user.findUnique({
      where: { email },
    });

    res.status(201).json({ message: "User registered successfully!", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials!" });
    }

    const token = jwt.generateToken(user.id);
    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
