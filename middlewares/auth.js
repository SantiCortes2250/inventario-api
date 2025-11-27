const jwt = require('jsonwebtoken');

module.exports = (rolesPermitidos = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader)
        return res.status(401).json({ error: 'Token no proporcionado' });

      const token = authHeader.split(" ")[1]; // formato: Bearer <token>

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded; // { id, rol }

      // Validar roles si rolesPermitidos no está vacío
      if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(req.user.rol)) {
        return res.status(403).json({ error: 'No tienes permiso para esta acción' });
      }

      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
  };
};
