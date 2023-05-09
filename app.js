require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const {
  main,
  addPost,
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
app.get("/add-blog", (req, res) => {
  const postTitle = "hello new post";
  const postSnippet = "hello new post snippet";
  const postBody = "hello new post body";

  addPost(postTitle, postSnippet, postBody)
    .then(() => {
      res.send(
        JSON.stringify({
          message: "created",
        })
      );
    })
    .catch((e) => {
      console.error(e);
    });
});

app.get("/view-blog", (req, res) => {
  const ressPost = getPostByID(1);

  ressPost.then((post) => res.send(post)).catch((e) => console.error(e));
  // console.log(ressPost + "Hello");
});

app.get("/delete-post", (req, res) => {
  const id = 2;
  const delPost = deletePost(id);

  delPost.then((post) => res.send(post)).catch((e) => console.error(e));
});
app.get("/", (req, res) => {
  // const ress = [
  //   {
  //     title: "Example 1",
  //     snippet: "This is an example snippet.",
  //     body: "This is an example body. It can contain more detailed information about the example.",
  //   },
  //   {
  //     title: "Example 2",
  //     snippet: "Another example snippet.",
  //     body: "This is a different example body. It could contain information about how the example differs from the first one.",
  //   },
  //   {
  //     title: "Example 3",
  //     snippet: "Yet another example snippet.",
  //     body: "And here's another example body. This one could provide information about a completely different aspect of the object.",
  //   },
  // ];

  const ress = getAllPosts()
    .then((ress) => {
      res.render("index", { title: "Home", ress: ress });
    })
    .catch((e) => console.error(e));
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
