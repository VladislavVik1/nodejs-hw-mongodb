export const handleError = (err, req, res, next) => {
  // Mongo duplicate email -> 409
  if (err?.code === 11000) {
    return res.status(409).json({ status: 'error', message: 'Email in use' });
  }
  const { status = 500, message = 'Internal Server Error' } = err;
  res.status(status).json({ status: 'error', message });
};
