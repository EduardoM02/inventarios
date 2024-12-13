const express = require('express');
const router = express.Router();
const db = require('../models/db'); // Conexión a la base de datos



// Obtener todos los productos
router.get('/', (req, res) => {

    db.query('SELECT * FROM productos', (err, results) => {

        if (err) return res.status(500).json({ error: err.message });
        res.json(results); // Enviar los datos como JSON

    });

});



// Agregar un nuevo producto
router.post('/', (req, res) => {

    const { nombre, sku, cantidad, precio_unitario, ubicacion, id_proveedor } = req.body;

    db.query('INSERT INTO productos (nombre, sku, cantidad, precio_unitario, ubicacion, id_proveedor) VALUES (?, ?, ?, ?, ?, ?)', 
        [nombre, sku, cantidad, precio_unitario, ubicacion, id_proveedor], 
        (err, results) => {

            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: results.insertId, mensaje: 'Producto agregado correctamente' });

        }

    );

});



// Editar un producto
router.put('/:id', (req, res) => {

    const { nombre, cantidad, precio_unitario, ubicacion } = req.body;
    const { id } = req.params;

    db.query('UPDATE productos SET nombre = ?, cantidad = ?, precio_unitario = ?, ubicacion = ? WHERE id_producto = ?', 
        [nombre, cantidad, precio_unitario, ubicacion, id], 
        (err) => {

            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Producto actualizado correctamente' });

        }

    );

});



// Eliminar un producto
router.delete('/:id', (req, res) => {
    
    const { id } = req.params;

    db.query('DELETE FROM productos WHERE id_producto = ?', [id], (err) => {

        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Producto eliminado correctamente' });

    });

});


module.exports = router;
