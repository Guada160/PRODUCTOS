const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

// Crear o conectar base de datos
const db = new Database("productos.db");

// Crear tabla
db.prepare(`
CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    stock INTEGER,
    precio REAL
)
`).run();

// Insertar datos iniciales si la tabla está vacía
const count = db.prepare("SELECT COUNT(*) as total FROM productos").get();

if (count.total === 0) {
    const insert = db.prepare("INSERT INTO productos (nombre, stock, precio) VALUES (?, ?, ?)");
    insert.run("Teclado", 10, 15000);
    insert.run("Mouse", 20, 8000);
    insert.run("Monitor", 5, 120000);
}

// Endpoint: obtener todos los productos
app.get("/productos", (req, res) => {
    const productos = db.prepare("SELECT * FROM productos").all();
    res.json(productos);
});

// Endpoint: obtener producto por id
app.get("/productos/:id", (req, res) => {
    const id = req.params.id;
    const producto = db.prepare("SELECT * FROM productos WHERE id = ?").get(id);

    if (!producto) {
        res.json({ mensaje: "Producto no encontrado" });
    } else {
        res.json(producto);
    }
});
app.get("/", (req, res) => {
    res.send("API funcionando");
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});