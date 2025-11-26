const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./readinglist");

User.hasMany(Blog);
User.hasMany(ReadingList);
Blog.belongsTo(User);
ReadingList.belongsTo(User, { foreignKey: "user_id" });
ReadingList.belongsTo(Blog, { foreignKey: "blog_id" });

// Uncomment the following lines to sync the models with the database

// User.sync({ alter: true }).then(() => {
//   return Blog.sync({ alter: true });
// });

module.exports = {
  Blog,
  User,
  ReadingList,
};
