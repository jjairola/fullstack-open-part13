const { DatabaseError, UniqueConstraintError, ValidationError} = require("sequelize");

class HTTPError extends Error {}

class NotFoundError extends HTTPError {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class BadRequestError extends HTTPError {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

class UnauthorizedError extends HTTPError {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

class ServerError extends HTTPError {
  constructor(message) {
    super(message);
    this.name = "ServerError";
    this.statusCode = 500;
  }
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  console.log(error.name);

  if (error instanceof HTTPError) {
    return response.status(error.statusCode).json({ error: error.message });
  }

  if (error instanceof DatabaseError) {
    return response.status(400).json({ error: error.message });
  }

  if (error instanceof UniqueConstraintError) {
    return response.status(400).json({ error: error.message });
  }

  if (error instanceof ValidationError) {
    return response.status(400).json({ error: error.message });
  }

  if (error instanceof Error) {
    return response.status(500).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  errorHandler,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ServerError,
};
