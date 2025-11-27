# 📦 API de Inventario — Node.js, Express, Sequelize, PostgreSQL

**Proyecto desarrollado como parte de una prueba técnica, con un enfoque profesional y completo.
Incluye autenticación con JWT, roles, CRUD de productos, módulo de compras, facturación, historial, validaciones, logs avanzados con Winston, manejo centralizado de errores y documentación automática con ApiDoc.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología            | Uso                                  |
| --------------------- | ------------------------------------ |
| **Node.js + Express** | Backend y creación de endpoints REST |
| **Sequelize ORM**     | Modelado de datos y consultas a BD   |
| **PostgreSQL**        | Base de datos relacional             |
| **JWT**               | Autenticación mediante tokens        |
| **bcryptjs**          | Encriptación de contraseñas          |
| **dotenv**            | Variables de entorno                 |
| **morgan**            | Logs HTTP básicos                    |
| **Winston**           | Logger avanzado a archivos y consola |
| **express-validator** | Validación de entradas en endpoints  |
| **ApiDoc**            | Documentación automática de la API   |



---

## 📘 Descripción del Proyecto

La API permite gestionar usuarios, productos y compras con separación estricta de permisos.

👑 Administrador

✔ CRUD completo de productos
✔ Gestión de inventario
✔ Visualización de todas las compras de los clientes
✔ Información detallada: productos, cantidades, totales, fecha y usuario

👤 Cliente

✔ Realizar compras
✔ Factura completa por compra
✔ Historial de compras propio

---

# 🧭 Estructura del Proyecto
```bash

inventario-api/
│── config/
│── controllers/
│── docs/        ← Documentación generada por ApiDoc
│── logs/
│── middlewares/
│── migrations/
│── models/
│── routes/
│── seeders/
│── utils/
│── validators/
│── server.js
│── README.md
│── .env


```

---

## ⚙️ Instalación y Configuración

```bash
# 1️⃣ Clonar el repositorio
git clone https://github.com/SantiCortes2250/inventario-api
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

# 4️⃣ Configurar la base de datos
Asegúrate de tener PostgreSQL instalado y en ejecución. Crea la base de datos especificada en DB_NAME.

# 5️⃣ Ejecutar migraciones
npx sequelize-cli db:migrate


# 6️⃣ Generar documentación
npm run apidoc

# 7️⃣ Iniciar la aplicación
npm run dev

```

---

## 🗄 Modelos Principales

# 📦 Producto

lote

nombre

precio

cantidad

fechaIngreso

# 🧾 Compra

usuarioId

total

fecha

# 📑 CompraDetalle

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
| POST   | `/api/register`    | Registrar nuevo usuario         | si          |
| POST   | `/api/login`       | Iniciar sesión y obtener token  | si          |


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


# 🧰 Validaciones

Se usa express-validator para:

✔ Productos: campos obligatorios, tipos de datos, mínimos
✔ Compras: estructura de productos, cantidades, IDs válidos
✔ Usuarios: email válido, contraseña mínima

Todos los errores son enviados en un formato unificado por middlewares/validate.js.

---

# 📛 Manejo Centralizado de Errores

Todos los errores de la API se envían hacia middlewares/errorHandler.js, permitiendo:

✔ Logs con Winston
✔ Respuestas claras y homogéneas
✔ Evita repetición de bloques try/catch

---


# 📛 Manejo Centralizado de Errores

📜 Logs Avanzados con Winston

Configurado en:

```bash utils/logger.js```

Incluye:

✔ Nivel info → consola + archivo
✔ Nivel error → archivo separado
✔ Log de intentos inválidos de compra
✔ Log de errores SQL
✔ Log de compras exitosas

---

# 📚 Documentación (ApiDoc)

📜 Logs Avanzados con Winston

Generación:

```bash npm run apidoc```

Salida:

```bash /docs/index.html```

Puedes abrirlo en el navegador para ver la documentación completa de la API.

---

# 🎯 Conclusión

Este proyecto cuenta con:

✔ CRUD completo
✔ Autenticación JWT
✔ Roles Admin/Cliente
✔ Compras + facturación + historial
✔ Validaciones robustas
✔ Logs avanzados
✔ Manejo centralizado de errores
✔ ApiDoc totalmente implementado


---