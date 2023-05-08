require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { prisma, main, addPost } = require("./models/post");
const { where } = require("sequelize");
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
app.get("/add-blog", (req, res) => {
  // const postTitle = "hello new post";
  // const postSnippet = "hello new post snippet";
  // const postBody = "hello new post body";

  // addPost(postTitle, postSnippet, postBody)
  //   .then(() => {
  //     res.send(
  //       JSON.stringify({
  //         message: "created",
  //       })
  //     );
  //   })
  //   .catch((e) => {
  //     console.error(e);
  //   });
  const postRess = prisma.post.findUnique({
    where: {
      id: 3,
    },
  });

  postRess
    .then((post) => res.send(JSON.stringify(post)))
    .catch((err) => console.error(err));
});
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
