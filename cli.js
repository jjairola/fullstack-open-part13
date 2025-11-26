require("dotenv").config();
const { Sequelize, QueryTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: false,
});

const main = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  const blogs = await sequelize.query("SELECT * FROM blogs", {
    type: QueryTypes.SELECT,
  });
  console.log(
    blogs
      .map((blog) => `${blog.author}: ${blog.title}, ${blog.likes}`)
      .join("\n")
  );
  sequelize.close();
};

main();
