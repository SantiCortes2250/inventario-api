const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { Compra, CompraDetalle, Producto, Usuario } = require('../models');
const { createCompraRules } = require('../validators/compraValidator');
const validate = require('../middlewares/validate');

// ===========================================
//   CREAR UNA COMPRA (CLIENTE)
// ===========================================
router.post('/', auth(['cliente', 'admin']), createCompraRules, validate, async (req, res) => {
  try {
    const { productos } = req.body;

    if (!productos || !Array.isArray(productos)) {
      return res.status(400).json({ error: "Debes enviar un arreglo de productos" });
    }

    let total = 0;

    // Verificar productos y calcular total
    for (let item of productos) {
      const prod = await Producto.findByPk(item.productoId);
      if (!prod) return res.status(404).json({ error: `Producto ID ${item.productoId} no existe` });

      if (prod.cantidad < item.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente para ${prod.nombre}` });
      }

      total += prod.precio * item.cantidad;
    }

    // Crear la compra
    const compra = await Compra.create({
      usuarioId: req.user.id,
      fecha: new Date(),
      total
    });

    // Crear detalles + Restar stock
    for (let item of productos) {
      const prod = await Producto.findByPk(item.productoId);

      await CompraDetalle.create({
        compraId: compra.id,
        productoId: prod.id,
        cantidad: item.cantidad,
        precioUnitario: prod.precio,
        subtotal: prod.precio * item.cantidad
      });

      // Restar inventario
      await prod.update({
        cantidad: prod.cantidad - item.cantidad
      });
    }

    res.json({ mensaje: "Compra realizada con éxito", compraId: compra.id });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al registrar compra" });
  }
});

// ===========================================
//     LISTAR TODAS LAS COMPRAS (ADMIN)
// ===========================================
router.get('/', auth(['admin']), async (req, res) => {
  try {
    const compras = await Compra.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
        {
          model: CompraDetalle,
          as: 'detalles',
          include: [{ model: Producto, as: 'producto' }]
        }
      ]
    });

    res.json(compras);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener compras" });
  }
});

// ===========================================
//     HISTORIAL DE COMPRAS DEL CLIENTE
// ===========================================
router.get('/mis-compras', auth(['cliente']), async (req, res) => {
  try {
    const compras = await Compra.findAll({
      where: { usuarioId: req.user.id },
      order: [['fecha', 'DESC']],
      include: [
        {
          model: CompraDetalle,
          as: 'detalles',
          include: [
            {
              model: Producto,
              as: 'producto',
              attributes: ['id', 'lote', 'nombre', 'precio']
            }
          ]
        }
      ]
    });

    res.json(compras);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener historial de compras" });
  }
});


// ===========================================
//   LISTAR TODAS LAS COMPRAS (ADMIN)
// ===========================================
router.get('/', auth(['admin']), async (req, res) => {
  try {
    const compras = await Compra.findAll({
      include: [
        { 
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: CompraDetalle,
          as: 'detalles',
          include: [{ model: Producto, as: 'producto' }]
        }
      ]
    });

    res.json(compras);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error al obtener compras",
      detalle: error.message
    });
  }
});


// ===========================================
//  OBTENER FACTURA / DETALLE DE UNA COMPRA
// ===========================================
router.get('/:id', auth(['cliente', 'admin']), async (req, res) => {
  try {
    const compra = await Compra.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
        {
          model: CompraDetalle,
          as: 'detalles',
          include: [{ model: Producto, as: 'producto' }]
        }
      ]
    });

    if (!compra) return res.status(404).json({ error: "Compra no encontrada" });

    // Si el cliente no es dueño, bloquear (solo admin puede ver todo)
    if (req.user.rol === 'cliente' && compra.usuarioId !== req.user.id) {
      return res.status(403).json({ error: "No puedes ver compras de otros usuarios" });
    }

    res.json(compra);

  } catch (error) {
    console.log("ERROR FACTURA:", error);
  res.status(500).json({ error: "Error al obtener factura", detalle: error.message });
  }
});








module.exports = router;
