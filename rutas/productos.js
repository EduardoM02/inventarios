const express = require('express');
const router = express.Router();
const db = require('../models/db'); +



// Obtener todos los productos
router.get('/', (req, res) => {

    db.query('SELECT * FROM productos', (err, results) => {

        if (err) return res.status(500).json({ error: err.message });
        res.json(results); 

    });

});



// Obtener detalles de un producto por ID
router.get('/:id', (req, res) => {

    const { id } = req.params;

    const query = `
        SELECT p.*, pr.nombre AS nombre_proveedor
        FROM productos p
        JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
        WHERE p.id_producto = ?
    `;

    db.query(query, [id], (err, results) => {

        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });

        res.json(results[0]);

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


// Obtener todos los productos con el nombre del proveedor
router.get('/', (req, res) => {

    const query = `
        SELECT p.*, pr.nombre AS nombre_proveedor
        FROM productos p
        JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
    `;

    db.query(query, (err, results) => {

        if (err) return res.status(500).json({ error: err.message });
        res.json(results);

    });

});


module.exports = router;
