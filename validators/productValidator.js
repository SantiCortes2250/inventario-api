const { body } = require('express-validator');

const createProductRules = [
  body('lote').exists().withMessage('lote es obligatorio').isString().trim().notEmpty(),
  body('nombre').exists().withMessage('nombre es obligatorio').isString().trim().notEmpty(),
  body('precio').exists().withMessage('precio es obligatorio').isFloat({ gt: 0 }).toFloat(),
  body('cantidad').exists().withMessage('cantidad es obligatoria').isInt({ min: 0 }).toInt(),
  body('fechaIngreso').exists().withMessage('fechaIngreso es obligatoria').isISO8601().toDate()
];

const updateProductRules = [
  // permitir partial update: valida si viene el campo
  body('lote').optional().isString().trim().notEmpty(),
  body('nombre').optional().isString().trim().notEmpty(),
  body('precio').optional().isFloat({ gt: 0 }).toFloat(),
  body('cantidad').optional().isInt({ min: 0 }).toInt(),
  body('fechaIngreso').optional().isISO8601().toDate()
];

module.exports = { createProductRules, updateProductRules };
