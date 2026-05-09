-- Base de datos
CREATE DATABASE IF NOT EXISTS proyectocongit CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE proyectocongit;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'vendedor') DEFAULT 'vendedor',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos con soporte de código de barra
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  stock INT NOT NULL DEFAULT 0,
  codigo_barra VARCHAR(50) UNIQUE,
  categoria VARCHAR(100),
  activo TINYINT(1) DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_codigo_barra (codigo_barra)
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de detalle de ventas
CREATE TABLE IF NOT EXISTS detalle_ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venta_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
);

-- Datos de ejemplo
INSERT IGNORE INTO productos (nombre, descripcion, precio, stock, codigo_barra, categoria) VALUES
  ('Arroz 1kg', 'Arroz blanco premium 1 kilogramo', 2.50, 100, '7501234567890', 'Alimentos'),
  ('Aceite 1L', 'Aceite vegetal botella 1 litro', 3.75, 80, '7509876543210', 'Alimentos'),
  ('Leche 1L', 'Leche entera pasteurizada 1 litro', 1.80, 150, '7504321098765', 'Lácteos'),
  ('Jabón de manos', 'Jabón antibacterial 250ml', 1.20, 200, '7506789012345', 'Higiene'),
  ('Cuaderno 100 hojas', 'Cuaderno universitario rayado 100 hojas', 2.00, 60, '7503456789012', 'Útiles');
