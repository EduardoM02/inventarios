const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

const secretKey = 'A1B2C3D4E5F6G7H8I9J10';


// Ruta de login
router.post('/login', (req, res) => {

    const { email, password } = req.body;

    db.query('SELECT * FROM empleados WHERE email = ?', [email], (err, results) => {

        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) return res.status(401).json({ error: 'Correo o contraseña incorrectos' });

        const empleado = results[0];

        bcrypt.compare(password, empleado.password, (err, isMatch) => {

            if (err) return res.status(500).json({ error: err.message });
            if (!isMatch) return res.status(401).json({ error: 'Correo o contraseña incorrectos' });

            const token = jwt.sign({ id: empleado.id_empleado, email: empleado.email }, secretKey, { expiresIn: '1h' });

            res.cookie('token', token, { httpOnly: true });
            res.json({ mensaje: 'Login exitoso' });

        });

    });

});


// Ruta de logout
router.post('/logout', (req, res) => {

    res.clearCookie('token');
    res.json({ mensaje: 'Logout exitoso' });

});


// Ruta de verificación de autenticación
router.get('/verify', (req, res) => {

    const token = req.cookies.token;

    if (!token) return res.status(401).json({ error: 'Acceso no autorizado' });

    jwt.verify(token, secretKey, (err, decoded) => {

        if (err) return res.status(401).json({ error: 'Acceso no autorizado' });
        res.json({ mensaje: 'Autenticado', email: decoded.email });

    });

});

module.exports = router;