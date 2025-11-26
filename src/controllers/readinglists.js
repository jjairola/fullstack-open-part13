const router = require("express").Router();
const { ReadingList } = require("../models");
const { User } = require("../models");
const { Blog } = require("../models");
const { NotFoundError, UnauthorizedError } = require("../util/errors");
const { requireSession } = require("../util/session");

router.post("/", async (req, res) => {
  const { blog_id, user_id } = req.body;

  const user = await User.findByPk(user_id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const blog = await Blog.findByPk(blog_id);
  if (!blog) {
    throw new NotFoundError("Blog not found");
  }

  const readingListEntry = await ReadingList.create({
    user_id,
    blog_id,
  });

  res.status(201).json(readingListEntry);
});

router.put("/:id", requireSession, async (req, res) => {
  const readingList = await ReadingList.findByPk(req.params.id);
  if (!readingList) {
    throw new NotFoundError("Readinglist not found");
  }

  const user = await User.findByPk(req.decodedToken.id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (readingList.userId !== user.id) {
    throw new UnauthorizedError("Readlinglist is not yours!");
  }

  readingList.read = req.body.read;
  await readingList.save();

  res.json(readingList);
});

module.exports = router;
