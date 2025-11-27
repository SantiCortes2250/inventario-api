const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1d';

module.exports = {
  async register(req, res) {
    try {
      const { nombre, email, password, rol } = req.body;

      // validaciones mínimas
      if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'nombre, email y password son requeridos' });
      }

      const exists = await Usuario.findOne({ where: { email } });
      if (exists) return res.status(409).json({ message: 'El email ya está registrado' });

      const usuario = await Usuario.create({
        nombre,
        email,
        password,
        rol: rol ? rol : 'cliente'
      });

      return res.status(201).json({ usuario }); // toJSON del modelo oculta password
    } catch (err) {
      console.error('register error:', err);
      return res.status(500).json({ message: 'Error al registrar usuario' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'email y password son requeridos' });

      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) return res.status(401).json({ message: 'Credenciales inválidas' });

      const ok = await bcrypt.compare(password, usuario.password);
      if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

      const payload = { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

      return res.json({ token, usuario: usuario.toJSON() });
    } catch (err) {
      console.error('login error:', err);
      return res.status(500).json({ message: 'Error en login' });
    }
  }
};
