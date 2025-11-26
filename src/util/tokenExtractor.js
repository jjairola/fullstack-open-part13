const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");
const { UnauthorizedError } = require("./errors");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      console.log(authorization.substring(7));
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedError("token invalid");
    }
  } else {
    throw new UnauthorizedError("token missing");
  }
  next();
};

module.exports = { tokenExtractor };
