require("dotenv").config();
// const { Sequelize } = require("sequelize");
const express = require("express");
const morgan = require("morgan");
const { sequelize, Ress } = require("./models/ress");
const app = express();
const port = 3000;

app.listen(port);
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    Ress.sync()
      .then(() => {
        console.log("Tables successfully created");
      })
      .catch((err) => {
        console.log("Unable to create table", err);
      });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.static("static"));
app.get("/", (req, res) => {
  const ress = [
    {
      title: "Example 1",
      snippet: "This is an example snippet.",
      body: "This is an example body. It can contain more detailed information about the example.",
    },
    {
      title: "Example 2",
      snippet: "Another example snippet.",
      body: "This is a different example body. It could contain information about how the example differs from the first one.",
    },
    {
      title: "Example 3",
      snippet: "Yet another example snippet.",
      body: "And here's another example body. This one could provide information about a completely different aspect of the object.",
    },
  ];
  res.render("index", { title: "Home", ress: ress });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/blog/create", (req, res) => {
  res.render("create", { title: "Create" });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "Not Found" });
});
