const { Session } = require("../models");
const router = require("express").Router();
const { BadRequestError } = require("../util/errors");

router.delete("/", async (req, res) => {
  // Jos on decoded token, on myos token.

  if (req.decodedToken) {
    try {
      await Session.destroy({ where: { token: req.token } });
    } catch (error) {
      throw new BadRequestError("already logged out");
    }
  } else {
    throw new BadRequestError("no session to logout from");
  }

  res.status(200).send({ message: "logged out" });
});

module.exports = router;
