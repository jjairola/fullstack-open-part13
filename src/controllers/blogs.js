const router = require("express").Router();
const { Op } = require("sequelize");

const { Blog } = require("../models");
const { User } = require("../models");
const { tokenExtractor } = require("../util/tokenExtractor");
const { NotFoundError, UnauthorizedError } = require("../util/errors");

router.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } },
    ];
  }

  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ["id", "username", "name"],
    },
    where,
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  const { author, url, title, likes } = req.body;
  const blog = await Blog.create({
    author,
    url,
    title,
    likes,
    userId: user.id,
  });
  res.status(201).json(blog);
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) {
    throw new NotFoundError("Blog not found");
  }
  return res.json(blog);
});

router.delete("/:id", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) {
    throw new NotFoundError("Blog not found");
  }
  if (blog.userId !== user.id) {
    throw new UnauthorizedError("forbidden");
  }
  await blog.destroy();

  res.status(204).end();
});

router.put("/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);

  if (!blog) {
    throw new NotFoundError("Blog not found");
  }

  blog.set({
    ...blog,
    ...req.body,
  });
  await blog.save();
  res.json(blog);
});

module.exports = router;
