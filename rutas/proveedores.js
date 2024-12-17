const express = require('express');
const router = express.Router();
const db = require('../models/db');



// Obtener todos los proveedores
router.get('/', (req, res) => {

    db.query('SELECT * FROM proveedores', (err, results) => {

        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
        
    });

});


// Obtener detalles de un proveedor por ID
router.get('/:id', (req, res) => {

    const { id } = req.params;

    db.query('SELECT * FROM proveedores WHERE id_proveedor = ?', [id], (err, results) => {

        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length === 0) return res.status(404).json({ error: 'Proveedor no encontrado' });

        res.json(results[0]);

    });

});



// Agregar un nuevo proveedor
router.post('/', (req, res) => {

    const { nombre, contacto, telefono, email, direccion } = req.body;

    db.query('INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)', 
        [nombre, contacto, telefono, email, direccion], 
        (err, results) => {

            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: results.insertId, mensaje: 'Proveedor agregado correctamente' });

        }

    );

});



// Editar un proveedor
router.put('/:id', (req, res) => {

    const { nombre, contacto, telefono, email, direccion } = req.body;
    const { id } = req.params;

    db.query('UPDATE proveedores SET nombre = ?, contacto = ?, telefono = ?, email = ?, direccion = ? WHERE id_proveedor = ?', 
        [nombre, contacto, telefono, email, direccion, id], 
        (err) => {

            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Proveedor actualizado correctamente' });

        }

    );

});



// Eliminar un proveedor
router.delete('/:id', (req, res) => {

    const { id } = req.params;

    db.query('DELETE FROM proveedores WHERE id_proveedor = ?', [id], (err) => {

        if (err) {

            if (err.code === 'ER_ROW_IS_REFERENCED_2') {

                return res.status(400).json({ error: 'No se puede eliminar el proveedor porque tiene productos asociados.' });
            
            }

            return res.status(500).json({ error: err.message });

        }

        res.json({ mensaje: 'Proveedor eliminado correctamente' });

    });
    
});


module.exports = router;
