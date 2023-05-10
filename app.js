require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const {
  main,
  createPost,
  getPostByID,
  getAllPosts,
  deletePost,
} = require("./models/post");
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
  res.send("All blogs...");
});
app.get("/blog/new", (req, res) => {
  res.render("create", { title: "Create" });
});

app.get("/blog/view", (req, res) => {
  res.send("Viewing blog...");
});
app.post("/blog/create", (req, res) => {
  res.send("Creating blog...");
});

app.get("/blog/delete", (req, res) => {
  res.send("Deleting blog...");
});

app.use((req, res) => {
  res.status(404).render("404", { title: "Not Found" });
});
