const express = require('express');
const router = express.Router();
const db = require('../models/db');



// Obtener todos los movimientos con los nombres de producto, empleado y proveedor
router.get('/', (req, res) => {

    const query = `
        SELECT m.*, p.nombre AS nombre_producto, e.nombre AS nombre_empleado, pr.nombre AS nombre_proveedor
        FROM movimientos m
        JOIN productos p ON m.id_producto = p.id_producto
        JOIN empleados e ON m.id_empleado = e.id_empleado
        LEFT JOIN proveedores pr ON m.id_proveedor = pr.id_proveedor
    `;

    db.query(query, (err, results) => {

        if (err) return res.status(500).json({ error: err.message });
        res.json(results);

    });

});


// Obtener detalles de un movimiento por ID
router.get('/:id', (req, res) => {

    const { id } = req.params;

    const query = `
        SELECT m.*, p.nombre AS nombre_producto, e.nombre AS nombre_empleado, pr.nombre AS nombre_proveedor
        FROM movimientos m
        JOIN productos p ON m.id_producto = p.id_producto
        JOIN empleados e ON m.id_empleado = e.id_empleado
        LEFT JOIN proveedores pr ON m.id_proveedor = pr.id_proveedor
        WHERE m.id_movimiento = ?
    `;

    db.query(query, [id], (err, results) => {

        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) return res.status(404).json({ error: 'Movimiento no encontrado' });
        
        res.json(results[0]);

    });
    
});



// Agregar un nuevo movimiento
router.post('/', (req, res) => {

    const { id_producto, tipo, cantidad, id_empleado, id_proveedor, motivo } = req.body;

    db.query('INSERT INTO movimientos (id_producto, tipo, cantidad, id_empleado, id_proveedor, motivo) VALUES (?, ?, ?, ?, ?, ?)', 
        [id_producto, tipo, cantidad, id_empleado, id_proveedor, motivo], 
        (err, results) => {

            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: results.insertId, mensaje: 'Movimiento registrado correctamente' });
            
        }

    );

});



// Editar un movimiento
router.put('/:id', (req, res) => {

    const { id_producto, tipo, cantidad, id_empleado, id_proveedor, motivo } = req.body;
    const { id } = req.params;

    db.query('UPDATE movimientos SET id_producto = ?, tipo = ?, cantidad = ?, id_empleado = ?, id_proveedor = ?, motivo = ? WHERE id_movimiento = ?', 
        [id_producto, tipo, cantidad, id_empleado, id_proveedor, motivo, id], 
        (err) => {

            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Movimiento actualizado correctamente' });

        }

    );

});



// Eliminar un movimiento
router.delete('/:id', (req, res) => {

    const { id } = req.params;

    db.query('DELETE FROM movimientos WHERE id_movimiento = ?', [id], (err) => {

        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Movimiento eliminado correctamente' });

    });

});


module.exports = router;
