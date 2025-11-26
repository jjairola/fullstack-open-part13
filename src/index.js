const express = require("express");
const app = express();
const { errorHandler } = require("./util/errors");

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

app.use(express.json());

app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
