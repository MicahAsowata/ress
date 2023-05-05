const express = require("express");
const app = express();
const port = 3000;
const root = {
  root: __dirname,
};
app.listen(port);

app.get("/", (req, res) => {
  res.sendFile("./views/index.html", root);
});

app.get("/about", (req, res) => {
  res.sendFile("./views/about.html", root);
});

app.get("/about-us", (req, res) => {
  res.redirect("/about");
});

app.use((req, res) => {
  res.status(404).sendFile("./views/404.html", root);
});
