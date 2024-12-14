const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models/db');


// Obtener todos los empleados
router.get('/', (req, res) => {

    db.query('SELECT * FROM empleados', (err, results) => {

        if (err) return res.status(500).json({ error: err.message });
        res.json(results); 

    });

});


// Obtener detalles de un empleado por ID
router.get('/:id', (req, res) => {

    const { id } = req.params;

    db.query('SELECT * FROM empleados WHERE id_empleado = ?', [id], (err, results) => {

        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {

            return res.status(404).json({ mensaje: 'Empleado no encontrado' });

        }

        res.json(results[0]); 

    });

});


// Agregar un nuevo empleado
router.post('/', async (req, res) => {

    const { nombre, email, password, rol } = req.body;

    // Encriptar la contraseña
    try {

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt); 

        db.query('INSERT INTO empleados (nombre, email, password, rol) VALUES (?, ?, ?, ?)', 
            [nombre, email, hashedPassword, rol], 
            (err, results) => {

                if (err) return res.status(500).json({ error: err.message });
                res.json({ mensaje: 'Empleado agregado correctamente' });

            }

        );

    } catch (error) {

        return res.status(500).json({ error: 'Error en la encriptación de la contraseña' });

    }

});



// Editar un empleado
router.put('/:id', (req, res) => {

    const { nombre, email, password, rol } = req.body;
    const { id } = req.params;

    // Si la contraseña está siendo actualizada, encriptarla
    let query = 'UPDATE empleados SET nombre = ?, email = ?, rol = ? WHERE id_empleado = ?';
    let values = [nombre, email, rol, id];

    if (password) {

        // Encriptar la nueva contraseña
        bcrypt.hash(password, 10, (err, hashedPassword) => {

            if (err) return res.status(500).json({ error: 'Error en la encriptación de la contraseña' });

            // Si hay nueva contraseña, la añadimos a la consulta SQL
            query = 'UPDATE empleados SET nombre = ?, email = ?, password = ?, rol = ? WHERE id_empleado = ?';
            values = [nombre, email, hashedPassword, rol, id];

            db.query(query, values, (err, results) => {

                if (err) return res.status(500).json({ error: err.message });
                res.json({ mensaje: 'Empleado actualizado correctamente' });

            });

        });

    } else {

        // Si no hay nueva contraseña, solo actualizar los otros datos
        db.query(query, values, (err, results) => {

            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Empleado actualizado correctamente' });

        });

    }

});



// Eliminar un empleado
router.delete('/:id', (req, res) => {

    const { id } = req.params;

    db.query('DELETE FROM empleados WHERE id_empleado = ?', [id], (err) => {

        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Empleado eliminado correctamente' });

    });
    
});


module.exports = router;
