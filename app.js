require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { PrismaClient } = require("@prisma/client");
const { main } = require("./models/post");
const { exit } = require("node:process");
const validator = require("validatorjs");
const lodash = require("lodash");
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

app.get("/blog/view/", (req, res) => {
  res.send("Viewing blog...");
});
app.post("/blog/create", (req, res) => {
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
    prisma.post
      .create({
        data: postData,
      })
      .then(() => {
        res.status(200).render("Created new post successfullyu");
      });
  } else if (validation.fails()) {
    return "Validation failed";
  }
});

app.get("/blog/delete", (req, res) => {
  res.send("Deleting blog...");
});

app.use((req, res) => {
  res.status(404).render("404", { title: "Not Found" });
});
