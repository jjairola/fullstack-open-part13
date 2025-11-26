const router = require("express").Router();
const { Op, fn, col } = require("sequelize");

const { Blog } = require("../models");

router.get("/", async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [fn('COUNT', col('id')), 'blogs'],
      [fn('SUM', col('likes')), 'likes'],
    ],
    group: ['author'],
    where: {
      author: { [Op.ne]: null }
    },
    order: [[fn('SUM', col('likes')), 'DESC']]
  });
  res.json(authors);
});

module.exports = router;