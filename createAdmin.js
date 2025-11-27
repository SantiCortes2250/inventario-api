const { Usuario, sequelize } = require('./models');

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log("Conexión OK. Creando admin...");

    const admin = await Usuario.create({
      nombre: "Admin",
      email: "admin@local",
      password: "admin123",
      rol: "admin"
    });

    console.log("✔️ Admin creado con ID:", admin.id);
  } catch (error) {
    console.error("❌ Error creando admin:", error);
  } finally {
    process.exit();
  }
}

createAdmin();
