'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Compra extends Model {
    static associate(models) {

       // Relación correcta con CompraDetalle
      Compra.hasMany(models.CompraDetalle, {
        foreignKey: 'compraId',
        as: 'detalles'
      });

      // Relación con usuario
      Compra.belongsTo(models.Usuario, {
        foreignKey: 'usuarioId',
        as: 'usuario'
      });

     
    }
  }

  Compra.init({
    fecha: DataTypes.DATE,
    total: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Compra',
    tableName: 'Compras'
  });

  return Compra;
};
