const { body } = require('express-validator');

const createCompraRules = [
  body('productos').exists().withMessage('productos es obligatorio').isArray({ min: 1 }),
  body('productos.*.productoId').exists().withMessage('productoId es obligatorio').isInt({ gt: 0 }).toInt(),
  body('productos.*.cantidad').exists().withMessage('cantidad es obligatoria').isInt({ gt: 0 }).toInt()
];

module.exports = { createCompraRules };
