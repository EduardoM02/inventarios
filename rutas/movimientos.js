const express = require('express');
const router = express.Router();
const db = require('../models/db');



// Obtener todos los movimientos
router.get('/', (req, res) => {

    db.query('SELECT * FROM movimientos', (err, results) => {

        if (err) return res.status(500).json({ error: err.message });
        res.json(results);

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
