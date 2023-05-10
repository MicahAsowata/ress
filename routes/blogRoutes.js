const express = require("express");
const {
  blog_index,
  blog_create_get,
  blog_create_post,
  blog_delete,
  blog_details,
} = require("../controller/blogController");
const router = express.Router();
router.get("/", blog_index);
router.get("/new", blog_create_get);

router.post("/create", blog_create_post);

router.get("/:id", blog_details);

router.get("/delete/:id", blog_delete);

module.exports = {
  router,
};
