const express = require("express");
const morgan = require("morgan");
const lodash = require("lodash");
const { main } = require("./models/post");
const { router } = require("./routes/blogRoutes");
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
app.set();

app.use(morgan("dev"));
app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/blog");
});
app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});
app.use("/blog", router);
app.use((req, res) => {
  res.status(404).render("error", { title: "Not Found", message: "🙅🏾‍♂️🙅🏾‍♂️🙅🏾‍♂️🙅🏾‍♂️" });
});
