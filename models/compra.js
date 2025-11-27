'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Compra extends Model {
    static associate(models) {

     
      Compra.hasMany(models.CompraDetalle, {
        foreignKey: 'compraId',
        as: 'detalles'
      });

   
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
