# Proyecto GIT

## 🎯 Descripción Rápida
Proyecto API REST con sistema de gestión de productos y **lector de códigos de barra manual** para divulgación educativa.

## ✨ Características Principales
- 🔐 Autenticación con JWT
- 📱 Responsive design con Bootstrap 5
- 🚀 Alta performance
- 📦 Patrón MVC
- 🔍 **Lector de códigos de barra USB/HID** (plug-and-play)
- 🛒 Carrito de venta con sesión en pantalla

## 🛠️ Tecnologías
**Backend:** Node.js, Express, MySQL  
**Frontend:** Bootstrap 5, EJS  
**DevOps:** GitHub Actions

## 🚀 Instalación y uso

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MySQL

# 3. Crear la base de datos
mysql -u root -p < database/migration.sql

# 4. Iniciar el servidor
npm start
# Desarrollo con recarga automática:
npm run dev
```

Abre http://localhost:3000 en tu navegador.

## 📡 API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/api/productos` | Lista todos los productos |
| `GET`  | `/api/productos/barcode/:codigo` | Busca por código de barra |
| `POST` | `/api/productos` | Crea un nuevo producto |

### Ejemplo de búsqueda por código de barra

```bash
curl http://localhost:3000/api/productos/barcode/7501234567890
```

```json
{
  "producto": {
    "id": 1,
    "nombre": "Arroz 1kg",
    "precio": "2.50",
    "stock": 100,
    "codigo_barra": "7501234567890",
    "categoria": "Alimentos"
  }
}
```

## 🔍 Uso del Lector de Códigos de Barra

1. Conecta tu lector USB (se reconoce automáticamente como teclado).
2. Ve a la ruta `/scanner` en el navegador.
3. El cursor se posiciona automáticamente en el campo de entrada.
4. Escanea el producto → el código aparece y se busca automáticamente.
5. También puedes escribir el código manualmente y presionar **Enter**.
6. El producto aparece con nombre, precio y stock.
7. Selecciona la cantidad y agrégalo al carrito de venta.

## 🗂️ Estructura del Proyecto

```
├── app.js                  # Punto de entrada
├── config/
│   └── db.js               # Conexión a MySQL
├── controllers/
│   └── productoController.js
├── models/
│   └── Producto.js         # findByBarcode(), findAll(), create()
├── routes/
│   ├── api.js              # Rutas /api/*
│   └── views.js            # Rutas de vistas
├── views/
│   ├── scanner.ejs         # Página del lector de códigos de barra
│   ├── inventario.ejs      # Listado de productos
│   ├── index.ejs           # Inicio
│   ├── error.ejs
│   └── partials/
│       ├── navbar.ejs
│       └── footer.ejs
├── public/
│   ├── js/barcode.js       # Lógica del scanner (cliente)
│   └── css/estilos.css
├── database/
│   └── migration.sql       # Tablas y datos de ejemplo
└── .env.example
```
