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

async function createPost(title, snippet, content) {
  const strTitle = lodash.toString(title);
  const strSnippet = lodash.toString(snippet);
  const strContent = lodash.toString(content);
  const rules = {
    title: "required|max:100",
    snippet: "required|max:250",
    content: "required",
  };
  const postData = {
    title: strTitle,
    snippet: strSnippet,
    content: strContent,
  };
  const validation = new validator(postData, rules);

  if (validation.passes()) {
    await prisma.post.create({
      data: postData,
    });
  } else if (validation.fails()) {
    return "Validation failed";
  }
}

async function getPostByID(id) {
  const post = await prisma.post.findUnique({
    where: {
      id: lodash.toString(id),
    },
  });

  return post;
}

async function getAllPosts() {
  const posts = await prisma.post.findMany();

  return posts;
}

async function deletePost(id) {
  const intID = lodash.toString(id);

  const post = await prisma.post.delete({
    where: {
      id: intID,
    },
  });

  return post;
}
module.exports = {
  main,
};
