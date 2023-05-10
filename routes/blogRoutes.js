const express = require("express");
const { PrismaClient } = require("@prisma/client");
const validator = require("validatorjs");
const lodash = require("lodash");
const prisma = new PrismaClient();
const router = express.Router();
router.get("/blogs", (req, res) => {
  const posts = prisma.post
    .findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    .then((posts) => {
      res.render("index", { title: "All posts", ress: posts });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).render("error", {
        title: "Server error",
        message: "Could not fetch data from server",
      });
    });
});
router.get("/blog/new", (req, res) => {
  res.render("create", { title: "Create" });
});

router.post("/blog/create", (req, res) => {
  const strTitle = lodash.toString(req.body.title);
  const strSnippet = lodash.toString(req.body.snippet);
  const strContent = lodash.toString(req.body.content);
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
    prisma.post
      .create({
        data: postData,
      })
      .then(() => {
        res.redirect("/");
      })
      .catch((error) => {
        res.status(500).render("error", {
          title: "Server Error",
          message: "Could not create ress",
        });
      });
    return;
  } else if (validation.fails()) {
    res.status(402).render("error", {
      title: "Invalid form data",
      message: "Too much errors from your form",
    });
  }
});

router.get("/blog/:id", (req, res) => {
  const id = lodash.toString(req.params.id);
  const post = prisma.post.findUnique({
    where: {
      id: id,
    },
  });

  post
    .then((post) => {
      res.render("ress", { title: post.title, ress: post });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).render("error", {
        title: "Server Error",
        message: "Could not fetch ress from server",
      });
    });
});

router.get("/blog/delete/:id", (req, res) => {
  const id = lodash.toString(req.params.id);
  const post = prisma.post.delete({
    where: {
      id: id,
    },
  });

  post
    .then(() => {
      res.redirect("/blogs");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).render("error", {
        title: "Server Error",
        message: "Could not fetch ress from server",
      });
    });
});

module.exports = {
  router,
};
