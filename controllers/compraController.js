// controllers/compraController.js

const { Compra, CompraDetalle, Producto, Cliente } = require('../models');

exports.obtenerFactura = async (req, res) => {
    try {
        const compra = await Compra.findOne({
            where: { id: req.params.id },
            include: [
                { model: Cliente, as: "cliente" },
                { 
                    model: CompraDetalle, 
                    as: "detalles",
                    include: [{ model: Producto, as: "producto" }]
                }
            ]
        });

        if (!compra) {
            return res.status(404).json({ mensaje: "Compra no encontrada" });
        }

        const factura = {
            compraId: compra.id,
            fecha: compra.fecha,
            cliente: compra.cliente,
            productos: compra.detalles.map(d => ({
                productoId: d.productoId,
                nombre: d.producto.nombre,
                cantidad: d.cantidad,
                precioUnitario: d.precioUnitario,
                subtotal: d.subtotal
            })),
            total: compra.total
        };

        res.json(factura);

    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener factura", error });
    }
};
