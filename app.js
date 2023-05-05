const express = require("express");
const app = express();
const port = 3000;
const root = {
  root: __dirname,
};

app.listen(port);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/about-us", (req, res) => {
  res.redirect("/about");
});

app.use((req, res) => {
  res.status(404).render("404");
});
