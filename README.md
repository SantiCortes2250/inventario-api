# 📦 API de Inventario — Node.js, Express, Sequelize, PostgreSQL

**Este proyecto implementa un API RESTful para la gestión de inventario y compras, desarrollado como parte de una prueba técnica.
Incluye autenticación con JWT, manejo de roles (Administrador y Cliente), CRUD de productos, módulo de compras, facturación e historial, además de buenas prácticas como validaciones, logs y manejo de errores.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología          | Uso                                                  |
|---------------------|------------------------------------------------------|
| **Node.js + Express** | Backend del proyecto y creación de endpoints REST   |
| **Sequelize ORM**     | Modelado de datos, migraciones y consultas a BD     |
| **PostgreSQL**        | Base de datos relacional usada para el sistema      |
| **JWT**               | Mecanismo de autenticación por tokens               |
| **bcryptjs**          | Encriptación y verificación de contraseñas          |
| **dotenv**            | Manejo de variables de entorno                      |
| **morgan**            | Registro detallado de peticiones HTTP               |
| **express-validator** | Validación de datos en los endpoints                |


---

## 📘 Descripción del Proyecto

El sistema gestiona usuarios, productos y compras, diferenciando permisos entre:

👤 Roles
Administrador

✔ CRUD completo de productos
✔ Gestión de inventario
✔ Visualización de todas las compras
✔ Información detallada: fecha, cliente, productos, cantidad, precio total

Cliente

✔ Realizar compras de uno o varios productos
✔ Ver factura completa con detalle
✔ Ver su historial de compras

---




# 🧭 Project structure (root)
```bash

inventario-api/
│── controllers/
│── middlewares/
│── migrations/
│── models/
│── routes/
│── seeders/
│── utils/
│── app.js
│── config.json
│── README.md


```

---

## ⚙️ Instalación y Configuración

```bash
# 1️⃣ Clonar el repositorio
git clone https://github.com/<tu-usuario>/<tu-repo>.git
cd inventario-api

# 2️⃣ Instalar dependencias
npm install


# 3️⃣ Configurar variables de entorno
Crear un archivo .env en la raíz del proyecto con las siguientes variables:

PORT=3000
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=inventario_db
DB_HOST=localhost
JWT_SECRET=supersecreto123

# 4️⃣ Configurar la base de datos
Asegúrate de tener PostgreSQL instalado y en ejecución. Crea la base de datos especificada en DB_NAME.

# 5️⃣ Ejecutar migraciones
npx sequelize-cli db:migrate


# 6️⃣ (Opcional) Ejecutar seeders para datos iniciales
npx sequelize-cli db:seed:all

# 7️⃣ Iniciar la aplicación
npm run dev

---

---

## 🗄 Modelos Principales

# 📦 Producto

número de lote

nombre

precio

cantidad disponible

fecha de ingreso

# 🧾 Compra

usuarioId

total

fecha

📑 CompraDetalle

productoId

cantidad

precioUnitario

subtotal

# 👤 Usuario

nombre

email

contraseña

rol (admin o cliente)

---

## 🔐 Autenticación

La API utiliza JWT.
Se envía en los headers:


```bash Authorization: Bearer <token>```

---

---

## 📡 Tabla de Endpoints del Proyecto
# 🔐 Autenticación / Usuarios

| Método | Ruta               | Descripción                     | Protección |
|--------|--------------------|----------------------------------|------------|
| POST   | `/api/register`    | Registrar nuevo usuario         | ❌ Pública |
| POST   | `/api/login`       | Iniciar sesión y obtener token  | ❌ Pública |


# 📦 Productos (Administrador)

| Método | Ruta                 | Descripción         | Rol      |
| ------ | -------------------- | ------------------- | -------- |
| GET    | `/api/productos`     | Listar productos    | 👑 Admin |
| POST   | `/api/productos`     | Crear producto      | 👑 Admin |
| PUT    | `/api/productos/:id` | Actualizar producto | 👑 Admin |
| DELETE | `/api/productos/:id` | Eliminar producto   | 👑 Admin |


# 🛒 Compras (Cliente y Admin)

| Método | Ruta                       | Descripción                       | Rol                   |
| ------ | -------------------------- | --------------------------------- | --------------------- |
| POST   | `/api/compras`             | Crear compra                      | 👤 Cliente            |
| GET    | `/api/compras/mis-compras` | Historial del cliente autenticado | 👤 Cliente            |
| GET    | `/api/compras/:id`         | Ver factura / compra específica   | 👤 Cliente / 👑 Admin |
| GET    | `/api/compras`             | Listar todas las compras (admin)  | 👑 Admin              |


---




