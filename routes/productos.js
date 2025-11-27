const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { Producto } = require('../models');
const { createProductRules, updateProductRules } = require('../validators/productValidator');
const validate = require('../middlewares/validate');

// ============================
//   CREAR PRODUCTO (ADMIN)
// ============================

/**
 * @api {post} /productos Crear producto
 * @apiName CrearProducto
 * @apiGroup Productos
 * @apiPermission admin
 *
 * @apiBody {String} lote Número de lote.
 * @apiBody {String} nombre Nombre del producto.
 * @apiBody {Number} precio Precio unitario.
 * @apiBody {Number} cantidad Cantidad disponible.
 * @apiBody {Date} fechaIngreso Fecha de ingreso.
 *
 * @apiSuccess {String} mensaje Producto creado.
 */

router.post('/', auth(['admin']), createProductRules, validate, async (req, res, next) => {
  try {
    const { lote, nombre, precio, cantidad, fechaIngreso } = req.body;
    const nuevo = await Producto.create({ lote, nombre, precio, cantidad, fechaIngreso });
    res.status(201).json({ mensaje: "Producto creado", producto: nuevo });
  } catch (err) {
    next(err);
  }
});



// ============================
//    LISTAR PRODUCTOS
// ============================

/**
 * @api {get} /productos Listar productos
 * @apiName ListarProductos
 * @apiGroup Productos
 * @apiPermission admin
 *
 * @apiSuccess {Object[]} productos Lista de productos.
 */

router.get('/', auth(['admin']), async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// ============================
//     OBTENER POR ID
// ============================
router.get('/:id', auth(['admin']), async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    res.json(producto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

// ============================
//     ACTUALIZAR PRODUCTO
// ============================

/**
 * @api {put} /productos/:id Actualizar producto
 * @apiName ActualizarProducto
 * @apiGroup Productos
 * @apiPermission admin
 *
 * @apiParam {Number} id ID del producto.
 *
 * @apiSuccess {String} mensaje Producto actualizado.
 */

router.put('/:id', auth(['admin']), updateProductRules, validate, async (req, res, next) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    await producto.update(req.body);
    res.json({ mensaje: 'Producto actualizado', producto });
  } catch (err) {
    next(err);
  }
});

// ============================
//     ELIMINAR PRODUCTO
// ============================

/**
 * @api {delete} /api/productos/:id Eliminar producto
 * @apiName DeleteProducto
 * @apiGroup Productos
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} Authorization Token de acceso (Formato: "Bearer <token>").
 *
 * @apiParam {Number} id ID único del producto.
 *
 * @apiPermission admin
 *
 * @apiExample {curl} Ejemplo:
 *   curl -X DELETE "http://localhost:3000/api/productos/5" \
 *     -H "Authorization: Bearer <TOKEN_ADMIN>"
 *
 * @apiSuccess {String} mensaje Mensaje confirmando eliminación.
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "mensaje": "Producto eliminado"
 *   }
 *
 * @apiError (404) NotFound Producto no encontrado.
 * @apiError (401) Unauthorized Token no provisto o inválido.
 * @apiError (403) Forbidden Usuario no autorizado.
 *
 * @apiErrorExample {json} Error-NotFound:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Producto no encontrado"
 *   }
 */

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    await producto.destroy();

    res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al eliminar" });
  }
});

module.exports = router;
