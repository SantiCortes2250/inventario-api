const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const auth = require('../middlewares/auth');




// Registro
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) return res.status(400).json({ error: 'El email ya está registrado' });

    // No hashear aquí: el hook beforeCreate en el modelo se encarga
    const usuario = await Usuario.create({ nombre, email, password, rol });

    res.json({ usuario });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});


// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Usar método del modelo
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
