import createError from 'http-errors';

export const notFound = (req, res, next) => {
  next(createError(404, 'Route not found'));
};
