'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {

      Usuario.hasMany(models.Compra, {
        foreignKey: 'usuarioId',
        as: 'compras'
      });
    }

    validarPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }

  Usuario.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      rol: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'cliente'
      }
    },
    {
      sequelize,
      modelName: 'Usuario',
      tableName: 'Usuarios',

      hooks: {
        beforeCreate: async (usuario) => {
          if (usuario.password) {
            usuario.password = await bcrypt.hash(usuario.password, 10);
          }
        },
        beforeUpdate: async (usuario) => {
          if (usuario.changed('password')) {
            usuario.password = await bcrypt.hash(usuario.password, 10);
          }
        }
      }
    }
  );

  return Usuario;
};
