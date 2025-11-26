const router = require("express").Router();
const { NotFoundError } = require("../util/errors");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { Blog } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    // exclude: ['userId'] },
    include: {
      model: Blog,
      attributes: ['id', 'title', 'author', 'url', 'likes']
    }
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
  return res.json(user);
});

module.exports = router;
