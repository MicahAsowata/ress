const express = require("express");
const app = express();
const port = 3000;
app.listen(port);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/blog/create", (req, res) => {
  res.render("create");
});

app.use((req, res) => {
  res.status(404).render("404");
});
