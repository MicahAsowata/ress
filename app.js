const express = require("express");
const app = express();
const port = 3000;

app.listen(port);

app.get("/", (req, res) => {
  res.send("<h1>👋🏾🌍</h1>");
});

app.get("/about", (req, res) => {
  res.send("<h1>👋🏾👨🏿‍💻</h1>");
});
