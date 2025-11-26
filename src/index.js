require("dotenv").config();
const { Sequelize, Model, DataTypes } = require("sequelize");
const express = require("express");

const app = express();
app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL);

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blog",
  }
);
Blog.sync();

app.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

app.post("/api/blogs", async (req, res) => {
  const { author, url, title, likes } = req.body;
  const blog = await Blog.create({ author, url, title, likes });
  res.status(201).json(blog);
});

app.delete("/api/blogs/:id", async (req, res) => {
  const { id } = req.params;
  await Blog.destroy({ where: { id } });
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
