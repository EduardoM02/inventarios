let moduloActivo = 'empleados';

document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('nav ul li a');
    const tablaTitulo = document.getElementById('modulo-titulo');
    const camposFormulario = document.getElementById('campos-formulario');
    const modalFormulario = document.getElementById('modal-formulario');
    const btnRegistrar = document.getElementById('btn-registrar');
    


    // Cambiar módulo al hacer clic en la NavBar
    navLinks.forEach(link => {

        link.addEventListener('click', (e) => {

            e.preventDefault();
            moduloActivo = link.dataset.modulo;
            cargarModulo(moduloActivo);

        });

    });


    // Cargar campos dinámicos en el formulario
    const cargarCamposFormulario = (modulo) => {

        camposFormulario.innerHTML = ''; // Limpiar campos

        if (modulo === 'empleados') {

            camposFormulario.innerHTML = `
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" required>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                <label for="password">Contraseña:</label>
                <input type="password" id="password" name="password" required>
                <label for="rol">Rol:</label>
                <select id="rol" name="rol">
                    <option value="admin">Admin</option>
                    <option value="usuario">Usuario</option>
                </select>
            `;

        } else if (modulo === 'productos') {

            camposFormulario.innerHTML = `
                <label for="nombre">Nombre del producto:</label>
                <input type="text" id="nombre" name="nombre" required>
                <label for="cantidad">Cantidad:</label>
                <input type="number" id="cantidad" name="cantidad" required>
                <label for="precio_unitario">Precio Unitario:</label>
                <input type="number" step="0.01" id="precio_unitario" name="precio_unitario" required>
            `;

        }

        // Agrega más casos para otros módulos

    };


    // Abrir el modal para registrar/editar
    btnRegistrar.addEventListener('click', () => {

        cargarCamposFormulario(moduloActivo);
        modalFormulario.classList.remove('oculto'); // Mostrar el modal

    });


    // Cerrar el modal
    document.getElementById('btn-cerrar-modal').addEventListener('click', () => {

        modalFormulario.classList.add('oculto'); // Ocultar el modal

    });

});



// Función para cargar los datos del módulo seleccionado y llenar la tabla
const cargarModulo = (modulo) => {

    const tablaTitulo = document.getElementById('modulo-titulo');
    const tablaDatos = document.getElementById('tabla-datos');

    // Cambiar el título de la tabla según el módulo
    tablaTitulo.textContent = modulo.charAt(0).toUpperCase() + modulo.slice(1);

    // Hacer la solicitud al backend para obtener los datos del módulo
    fetch(`/api/${modulo}`)
        .then((response) => response.json())
        .then((data) => {

            // Llenar la tabla con los datos recibidos
            actualizarTabla(data, modulo);

        })
        .catch((error) => {

            console.error(`Error al cargar los datos del módulo ${modulo}:`, error);

        });

};


// Campos a mostrar por módulo
const camposAMostrar = {

    empleados: ['id_empleado', 'nombre', 'email', 'rol'], // Campos a mostrar para empleados
    productos: ['id_producto', 'nombre', 'cantidad'], // Campos a mostrar para productos
    

};



const actualizarTabla = (data, modulo) => {

    const thead = document.querySelector('#tabla-datos thead');
    const tbody = document.querySelector('#tabla-datos tbody');

    // Limpiar contenido existente
    thead.innerHTML = '';
    tbody.innerHTML = '';

    // Verificar si hay datos
    if (data.length === 0) {

        tbody.innerHTML = '<tr><td colspan="5">No hay registros disponibles</td></tr>';
        return;

    }

    // Obtener los campos a mostrar para el módulo actual
    const campos = camposAMostrar[modulo] || Object.keys(data[0]); // Si no está definido, muestra todos los campos

    // Generar cabecera de la tabla
    const headerRow = campos.map((campo) => `<th>${campo.charAt(0).toUpperCase() + campo.slice(1)}</th>`).join('');
    thead.innerHTML = `<tr>${headerRow}<th>Acciones</th></tr>`;

    // Generar filas de la tabla
    data.forEach((item) => {

        
        const idCampo = campos.find(campo => campo.includes('id')) || 'id';
        const idValor = item[idCampo]; 

        const row = campos.map((campo) => `<td>${item[campo] || ''}</td>`).join(''); // Solo muestra los campos especificados

        tbody.innerHTML += `
            <tr>
                ${row}
                <td>
                    <button onclick="verDetalles(${idValor})">Detalles</button>
                    <button onclick="abrirModalEdicion(${idValor})">Editar</button>
                    <button onclick="eliminarRegistro(${idValor}, '${modulo}')">Eliminar</button>
                </td>
            </tr>
        `;   
    });

};

const verDetalles = (id) => {

    
    fetch(`/api/${moduloActivo}/${id}`)

        .then((response) => response.json())
        .then((data) => {

           
            const btnCerrarDetalles = document.getElementById('btn-cerrar-detalles');
            const modalDetalles = document.getElementById('modal-detalles');
            const detallesContenido = modalDetalles.querySelector('.detalles-contenido');

            
            detallesContenido.innerHTML = '';

            btnCerrarDetalles.addEventListener('click', () => {

                modalDetalles.classList.add('oculto');

            });

            
            Object.keys(data).forEach((key) => {
                detallesContenido.innerHTML += `
                    <p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${data[key]}</p>
                `;
            });

            
            modalDetalles.classList.remove('oculto');

        })

        .catch((error) => {

            console.error(`Error al obtener los detalles del registro con ID ${id}:`, error);

        });

};


const abrirModalEdicion = (id) => {
    fetch(`/api/${moduloActivo}/${id}`)
        .then((response) => response.json())
        .then((data) => {
            const modalFormulario = document.getElementById('modal-formulario');
            const camposFormulario = document.getElementById('campos-formulario');
            const modalTitulo = document.getElementById('modal-titulo');
            const btnEnviar = document.getElementById('btn-enviar');

            // Cambia el título del modal
            modalTitulo.textContent = 'Editar Registro';

            // Limpia los campos del formulario
            camposFormulario.innerHTML = '';

            // Llena el formulario con los datos del registro
            Object.keys(data).forEach((key) => {
                if (key === 'id') {
                    camposFormulario.innerHTML += `
                        <label for="${key}">${key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                        <input type="text" id="${key}" name="${key}" value="${data[key]}" readonly>
                    `;
                } else if (key !== 'updated_at' && key !== 'created_at' && key !== 'password') {
                    camposFormulario.innerHTML += `
                        <label for="${key}">${key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                        <input type="text" id="${key}" name="${key}" value="${data[key]}" required>
                    `;
                }
            });

            // Agregar campo de contraseña con placeholder
            camposFormulario.innerHTML += `
                <label for="password">Contraseña:</label>
                <input type="password" id="password" name="password" placeholder="Escribir nueva contraseña">
            `;

            // Cambia el evento del botón de enviar para actualizar el registro
            btnEnviar.onclick = (event) => {
                event.preventDefault();
                const formData = new FormData(document.getElementById('formulario-dinamico'));
                const jsonData = {};
                formData.forEach((value, key) => {
                    jsonData[key] = value;
                });

                fetch(`/api/${moduloActivo}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jsonData)
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Registro actualizado:', data);
                    modalFormulario.classList.add('oculto');
                    // Actualiza la tabla de datos o realiza cualquier otra acción necesaria
                })
                .catch((error) => {
                    console.error('Error al actualizar el registro:', error);
                });
            };

            // Muestra el modal
            modalFormulario.classList.remove('oculto');
        })
        .catch((error) => {
            console.error('Error al obtener los detalles del registro:', error);
        });
};

// Agrega el evento de clic al botón de cerrar del modal de formulario
document.getElementById('btn-cerrar-modal').addEventListener('click', () => {
    document.getElementById('modal-formulario').classList.add('oculto');
});


// Evento para cargar el módulo al hacer clic en la NavBar
document.querySelectorAll('nav ul li a').forEach((link) => {

    link.addEventListener('click', (e) => {

        e.preventDefault();
        const modulo = link.dataset.modulo;
        cargarModulo(modulo); // Cargar los datos del módulo seleccionado

    });

});


// Cargar el módulo inicial al abrir la página
document.addEventListener('DOMContentLoaded', () => {

    cargarModulo('empleados'); // Cargar productos por defecto
    
});
