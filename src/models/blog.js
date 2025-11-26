const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

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
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1991,
        max: new Date().getFullYear(),
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "blog",
  }
);


Blog.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.userId;
  delete values.createdAt;
  delete values.updatedAt;
  return values;
};

module.exports = Blog;
