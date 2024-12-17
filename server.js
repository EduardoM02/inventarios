const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');


// Importar las rutas de cada módulo
const productosRouter = require('./rutas/productos');
const empleadosRouter = require('./rutas/empleados');
const proveedoresRouter = require('./rutas/proveedores');
const movimientosRouter = require('./rutas/movimientos');
const authRouter = require('./rutas/auth');


const app = express();


// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Middleware de autenticación
const authMiddleware = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) return res.status(401).json({ error: 'Acceso no autorizado' });

    jwt.verify(token, 'A1B2C3D4E5F6G7H8I9J10', (err, decoded) => {

        if (err) return res.status(401).json({ error: 'Acceso no autorizado' });

        req.user = decoded;
        next();

    });

};



// Rutas
app.use('/api/productos', authMiddleware, productosRouter); // CRUD de productos
app.use('/api/empleados', authMiddleware, empleadosRouter); // CRUD de empleados
app.use('/api/proveedores', authMiddleware, proveedoresRouter); // CRUD de proveedores
app.use('/api/movimientos', authMiddleware, movimientosRouter); // Gestión de movimientos
app.use('/api/auth', authRouter); // Rutas de autenticación

// Ruta principal
app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, 'public', 'index.html'));

});


// Servidor
const PORT = 3000;

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
