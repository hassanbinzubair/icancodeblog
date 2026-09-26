import express from "express";
import { Blog } from "./blog.model.js";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.find({})
      .select("title slug description")
      .sort({ _id: -1 })
      .lean();
    res.render("home", { Blogs: blogs });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).lean();
    if (!blog) {
      return res.status(404).render("404");
    }
    res.render("blogpage", {
      title: blog.title,
      description: blog.description,
      content: blog.content,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
