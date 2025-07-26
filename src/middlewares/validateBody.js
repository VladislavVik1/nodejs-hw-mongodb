const { BadRequest } = require("http-errors");

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(BadRequest(error.message));
    } else {
      next();
    }
  };
};

module.exports = validateBody;
