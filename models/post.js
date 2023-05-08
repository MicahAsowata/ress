const { PrismaClient } = require("@prisma/client");
const { exit } = require("node:process");
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to database");
  } catch (error) {
    console.error("Failed to connect to database", error);
    await prisma.$disconnect();
    console.log("Disconnected from database");
    exit(1);
  }
}

module.exports = {
  main,
  prisma,
};
