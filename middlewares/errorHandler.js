module.exports = (err, req, res, next) => {
  console.error(err); // console + winston se encargará de logs más adelante
  const status = err.status || 500;
  const payload = {
    error: err.name || 'InternalError',
    message: err.message || 'Error interno',
  };
  if (err.details) payload.details = err.details;
  res.status(status).json(payload);
};
