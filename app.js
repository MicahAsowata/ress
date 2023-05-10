require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { PrismaClient } = require("@prisma/client");
const validator = require("validatorjs");
const lodash = require("lodash");

const { main } = require("./models/post");

const prisma = new PrismaClient();

const app = express();
const port = 3000;

main()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Could not start server", error);
  });

app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/blogs");
});
app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/blogs", (req, res) => {
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
      res.status(500).render("Error fetching data from server");
    });
});
app.get("/blog/new", (req, res) => {
  res.render("create", { title: "Create" });
});

app.post("/blog/create", (req, res) => {
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
        res.status(500).render("Could not create the post");
      });
    return;
  } else if (validation.fails()) {
    res.status(402).render("Invalid form data");
  }
});

app.get("/blog/:id", (req, res) => {
  const id = lodash.toString(req.params.id);
  const post = prisma.post.findUnique({
    where: {
      id: id,
    },
  });

  console.log(post);

  post
    .then((post) => {
      res.render("ress", { title: post.title, ress: post });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).render("Could not fetch post from server");
    });
});

app.delete("/blog/delete", (req, res) => {
  res.send("Deleting blog...");
});

app.use((req, res) => {
  res.status(404).render("404", { title: "Not Found" });
});
