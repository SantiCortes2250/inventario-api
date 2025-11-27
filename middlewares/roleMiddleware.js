module.exports = function(allowedRoles = []) {
  // allowedRoles puede ser string 'admin' o array ['admin','otro']
  if (typeof allowedRoles === 'string') allowedRoles = [allowedRoles];

  return (req, res, next) => {
    try {
      const rol = req.user?.rol;
      if (!rol) return res.status(403).json({ message: 'Acceso denegado' });

      if (!allowedRoles.includes(rol)) {
        return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
      }
      next();
    } catch (err) {
      console.error('roleMiddleware error:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }
  };
};
