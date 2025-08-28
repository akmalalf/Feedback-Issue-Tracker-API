module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.expose ? err.message : 'Internal server error';
  const details = err.details;

  if (process.env.NODE_ENV !== 'production') {
    console.error('[ERROR]', { status, code, message, details, stack: err.stack });
  }

  res.status(status).json({ success: false, code, message, details });
};
