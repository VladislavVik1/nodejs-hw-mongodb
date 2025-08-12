export const handleError = (err, req, res, next) => {
  // Mongo duplicate key (e-mail уникален)
  if (err?.code === 11000) {
    return res.status(409).json({ status: 'error', message: 'Email in use' });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ status: 'error', message });
};
