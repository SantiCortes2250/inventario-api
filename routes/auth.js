const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const auth = require('../middlewares/auth');



/**
 * @api {post} /auth/register Registrar usuario
 * @apiName RegistrarUsuario
 * @apiGroup Auth
 *
 * @apiBody {String} nombre Nombre del usuario.
 * @apiBody {String} email Correo electrónico.
 * @apiBody {String} password Contraseña.
 * @apiBody {String} rol Rol del usuario ("admin" o "cliente").
 *
 * @apiSuccess {String} mensaje Usuario registrado correctamente.
 */

// Registro
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) return res.status(400).json({ error: 'El email ya está registrado' });


    const usuario = await Usuario.create({ nombre, email, password, rol });

    res.json({ usuario });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});


/**
 * @api {post} /auth/login Iniciar sesión
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiBody {String} email Correo del usuario.
 * @apiBody {String} password Contraseña.
 *
 * @apiSuccess {String} token Token JWT de acceso.
 */


// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });


    const valido = usuario.validarPassword(password);
    if (!valido) return res.status(400).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

router.get('/perfil', auth(), (req, res) => {
  res.json({ usuario: req.user });
});
module.exports = router;
