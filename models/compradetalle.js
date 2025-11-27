'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompraDetalle extends Model {

    static associate(models) {

      CompraDetalle.belongsTo(
        models.Compra, 
        { foreignKey: 'compraId', as: 'compra' }
      );


      CompraDetalle.belongsTo(
        models.Producto, 
        { foreignKey: 'productoId', as: 'producto' }
      );
    }
  }
  CompraDetalle.init({
    compraId: DataTypes.INTEGER,
    productoId: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER,
    precioUnitario: DataTypes.FLOAT,
    subtotal: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'CompraDetalle',
    tableName: 'CompraDetalles'
  });
  return CompraDetalle;
};