const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { Producto } = require('../models');

// ============================
//   CREAR PRODUCTO (ADMIN)
// ============================
router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { lote, nombre, precio, cantidad, fechaIngreso } = req.body;

    if (!lote || !nombre || !precio || !cantidad || !fechaIngreso) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const nuevo = await Producto.create({
      lote,
      nombre,
      precio,
      cantidad,
      fechaIngreso
    });

    res.json({ mensaje: "Producto creado", producto: nuevo });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear producto" });
  }
});

// ============================
//    LISTAR PRODUCTOS
// ============================
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
router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    await producto.update(req.body);

    res.json({ mensaje: "Producto actualizado", producto });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al actualizar" });
  }
});

// ============================
//     ELIMINAR PRODUCTO
// ============================
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
