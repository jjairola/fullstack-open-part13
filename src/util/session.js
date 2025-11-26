const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");
const { UnauthorizedError } = require("./errors");
const { Session } = require("../models");
const { User } = require("../models");

// ALL routes, automatically extract token.
const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    // {
    //   username: 'admin@admin.com',
    //   id: 2,
    //   iat: 1764186728,
    //   exp: 1764190328
    // }
    
    // Trhows error if token is invalid
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET);

    // This is null, if above trhows. So trust, if present in headers.
    req.token = authorization.substring(7);
  }

  next();
};

const requireSession = async (req, res, next) => {

  // Trust for token validity from client.
  if (!req.decodedToken) {
    throw new UnauthorizedError("session invalid");
  }

  // Get user from token id.
  const userId = req.decodedToken.id;
  if (!userId) {
    throw new UnauthorizedError("session invalid");
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new UnauthorizedError("session invalid");
  }

  console.log(user);

  // Handle disabled users.
  if (user.disabled) {
    throw new UnauthorizedError("user disabled");
  }

  // Handle session existence.
  const session = await Session.findOne({ where: { userId, token: req.token } });
  if (!session) {
    throw new UnauthorizedError("session invalid");
  }

  next();
};

module.exports = { tokenExtractor, requireSession };
