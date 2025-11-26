const router = require("express").Router();
const { NotFoundError } = require("../util/errors");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { Blog } = require("../models");
const { ReadingList } = require("../models");
const { BadRequestError } = require("../util/errors");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: ["id", "title", "author", "url", "likes"],
    },
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(req.body.password, saltRounds);
  const user = await User.create({ ...req.body, passwordHash });
  res.status(201).json(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const where = { userId: req.params.id };
  const read = req.query.read;
  if (read !== undefined) {
    if (!["true", "false"].includes(read)) {
      throw new BadRequestError("Read parameter not true or false");
    }
    where.read = read === "true";
  }

  const readingLists = await ReadingList.findAll({
    where,
    include: {
      model: Blog,
      attributes: ["id", "title", "author", "url", "likes", "year"],
    },
  });
  user.dataValues.readings = readingLists.map((rl) => ({
    ...rl.blog.dataValues,
    readinglists: { read: rl.read, id: rl.id },
  }));

  return res.json(user);
});

module.exports = router;
