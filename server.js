const express = require("express");
const app = require("./app");
const dotenv = require("dotenv");

// const Cors = express();

const { PrismaClient } = require("@prisma/client");

dotenv.config();

const PORT = process.env.PORT || 5000;

const prisma = new PrismaClient();

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await prisma.$connect();
  console.log("Connected to the database.");
});
