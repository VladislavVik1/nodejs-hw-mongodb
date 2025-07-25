export const handleError = (err, req, res, next) => {
    const { status = 500, message = 'Internal Server Error' } = err;
  
    res.status(status).json({
      status,
      message,
      data: err.message || 'Unexpected error',
    });
  };