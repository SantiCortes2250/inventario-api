const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { Compra, CompraDetalle, Producto, Usuario } = require("../models");
const { createCompraRules } = require("../validators/compraValidator");
const validate = require("../middlewares/validate");
const logger = require("../utils/logger");

// ===========================================
//   CREAR UNA COMPRA (CLIENTE)
// ===========================================
router.post(
  "/",
  auth(["cliente", "admin"]),
  createCompraRules,
  validate,
  async (req, res) => {
    logger.info(`Nueva solicitud de compra por UsuarioID=${req.user.id}`);

    try {
      const { productos } = req.body;

      if (!productos || !Array.isArray(productos)) {
        logger.warn(
          `Payload inválido en compra. UsuarioID=${req.user.id} Body=${JSON.stringify(req.body)}`
        );
        return res
          .status(400)
          .json({ error: "Debes enviar un arreglo de productos" });
      }

      let total = 0;

      // Verificar productos y calcular total
      for (let item of productos) {
        const prod = await Producto.findByPk(item.productoId);

        if (!prod) {
          logger.warn(
            `Producto inexistente solicitado. ProductoID=${item.productoId} UsuarioID=${req.user.id}`
          );
          return res
            .status(404)
            .json({ error: `Producto ID ${item.productoId} no existe` });
        }

        if (prod.cantidad < item.cantidad) {
          logger.warn(
            `Stock insuficiente. Producto=${prod.nombre} ID=${prod.id} Stock=${prod.cantidad} CantSolicitada=${item.cantidad} UsuarioID=${req.user.id}`
          );
          return res
            .status(400)
            .json({ error: `Stock insuficiente para ${prod.nombre}` });
        }

        total += prod.precio * item.cantidad;
      }

      // Crear la compra
      const compra = await Compra.create({
        usuarioId: req.user.id,
        fecha: new Date(),
        total,
      });

      logger.info(
        `Compra creada exitosamente. CompraID=${compra.id} UsuarioID=${req.user.id} Total=${total}`
      );

      // Crear detalles + Restar stock
      for (let item of productos) {
        const prod = await Producto.findByPk(item.productoId);

        await CompraDetalle.create({
          compraId: compra.id,
          productoId: prod.id,
          cantidad: item.cantidad,
          precioUnitario: prod.precio,
          subtotal: prod.precio * item.cantidad,
        });

        await prod.update({
          cantidad: prod.cantidad - item.cantidad,
        });

        logger.info(
          `Detalle registrado: CompraID=${compra.id} ProductoID=${prod.id} Cantidad=${item.cantidad}`
        );
      }

      return res.json({
        mensaje: "Compra realizada con éxito",
        compraId: compra.id,
      });
    } catch (error) {
      logger.error(
        `Error inesperado al registrar compra. UsuarioID=${req.user.id} Error=${error.message}`
      );
      return res.status(500).json({ error: "Error al registrar compra" });
    }
  }
);

// ===========================================
//     LISTAR TODAS LAS COMPRAS (ADMIN)
// ===========================================
router.get("/", auth(["admin"]), async (req, res) => {
  logger.info(`Admin UsuarioID=${req.user.id} solicitó todas las compras`);

  try {
    const compras = await Compra.findAll({
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nombre", "email"],
        },
        {
          model: CompraDetalle,
          as: "detalles",
          include: [{ model: Producto, as: "producto" }],
        },
      ],
    });

    return res.json(compras);
  } catch (error) {
    logger.error(
      `Error al obtener compras (Admin). UsuarioID=${req.user.id} Error=${error.message}`
    );
    return res.status(500).json({ error: "Error al obtener compras" });
  }
});

// ===========================================
//     HISTORIAL DE COMPRAS DEL CLIENTE
// ===========================================
router.get("/mis-compras", auth(["cliente"]), async (req, res) => {
  logger.info(`Cliente UsuarioID=${req.user.id} solicitó su historial de compras`);

  try {
    const compras = await Compra.findAll({
      where: { usuarioId: req.user.id },
      order: [["fecha", "DESC"]],
      include: [
        {
          model: CompraDetalle,
          as: "detalles",
          include: [
            {
              model: Producto,
              as: "producto",
              attributes: ["id", "lote", "nombre", "precio"],
            },
          ],
        },
      ],
    });

    return res.json(compras);
  } catch (error) {
    logger.error(
      `Error al obtener historial del cliente. UsuarioID=${req.user.id} Error=${error.message}`
    );
    return res.status(500).json({ error: "Error al obtener historial de compras" });
  }
});

// ===========================================
//  OBTENER FACTURA / DETALLE DE UNA COMPRA
// ===========================================
router.get("/:id", auth(["cliente", "admin"]), async (req, res) => {
  logger.info(
    `Solicitud de factura CompraID=${req.params.id} por UsuarioID=${req.user.id} Rol=${req.user.rol}`
  );

  try {
    const compra = await Compra.findByPk(req.params.id, {
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nombre", "email"],
        },
        {
          model: CompraDetalle,
          as: "detalles",
          include: [{ model: Producto, as: "producto" }],
        },
      ],
    });

    if (!compra) {
      logger.warn(`Intento de consultar factura inexistente: CompraID=${req.params.id}`);
      return res.status(404).json({ error: "Compra no encontrada" });
    }

    if (req.user.rol === "cliente" && compra.usuarioId !== req.user.id) {
      logger.warn(
        `Acceso denegado: UsuarioID=${req.user.id} intentó ver compra de otro usuario CompraID=${compra.id}`
      );
      return res
        .status(403)
        .json({ error: "No puedes ver compras de otros usuarios" });
    }

    logger.info(`Factura entregada. CompraID=${req.params.id} UsuarioID=${req.user.id}`);

    return res.json(compra);
  } catch (error) {
    logger.error(
      `Error al obtener factura. CompraID=${req.params.id} UsuarioID=${req.user.id} Error=${error.message}`
    );

    return res.status(500).json({
      error: "Error al obtener factura",
      detalle: error.message,
    });
  }
});

module.exports = router;
