const { PrismaClient } = require("@prisma/client");
const { exit } = require("node:process");
const validator = require("validatorjs");
const lodash = require("lodash");
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

async function addPost(title, snippet, body) {
  const strTitle = lodash.toString(title);
  const strSnippet = lodash.toString(snippet);
  const strBody = lodash.toString(body);
  const rules = {
    title: "required|max:100",
    snippet: "required|max:250",
    content: "required",
  };
  const postData = {
    title: strTitle,
    snippet: strSnippet,
    content: strBody,
  };
  const validation = new validator(postData, rules);

  if (validation.passes()) {
    // create user
    await prisma.post.create({
      data: postData,
    });
  } else if (validation.fails()) {
    return "Validation failed";
  }
}

async function getPostByID(id) {
  const postRess = await prisma.post.findUnique({
    where: {
      id: lodash.toNumber(id),
    },
  });

  return postRess;
}

async function getAllPosts() {
  const allPosts = await prisma.post.findMany();

  return allPosts;
}
module.exports = {
  main,
  prisma,
  addPost,
  getPostByID,
  getAllPosts,
};
