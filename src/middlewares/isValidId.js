const { isValidObjectId } = require("mongoose");
const HttpError = require("../helpers/HttpError");

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(HttpError(400, `${contactId} is not a valid Mongo ID`));
  }
  next();
};

module.exports = isValidId;
