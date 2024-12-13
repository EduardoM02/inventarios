const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


// Importar las rutas de cada módulo
const productosRouter = require('./rutas/productos');
const empleadosRouter = require('./rutas/empleados');
const proveedoresRouter = require('./rutas/proveedores');
const movimientosRouter = require('./rutas/movimientos');


const app = express();


// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// Rutas
app.use('/api/productos', productosRouter); // CRUD de productos
app.use('/api/empleados', empleadosRouter); // CRUD de empleados
app.use('/api/proveedores', proveedoresRouter); // CRUD de proveedores
app.use('/api/movimientos', movimientosRouter); // Gestión de movimientos

// Ruta principal
app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, 'public', 'index.html'));

});


// Servidor
const PORT = 3000;

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
