export const notFound = (req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
};
