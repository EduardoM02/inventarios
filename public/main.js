let moduloActivo = 'empleados';

document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('nav ul li a');
    const tablaTitulo = document.getElementById('modulo-titulo');
    const camposFormulario = document.getElementById('campos-formulario');
    const modalFormulario = document.getElementById('modal-formulario');
    const btnRegistrar = document.getElementById('btn-registrar');
    const btnEnviar = document.getElementById('btn-enviar');
    const modalExito = document.getElementById('modal-exito');
    const modalError = document.getElementById('modal-error');
    const modalConfirmacion = document.getElementById('modal-confirmacion');
    const btnCerrarExito = document.getElementById('btn-cerrar-exito');
    const btnCerrarError = document.getElementById('btn-cerrar-error');
    const btnConfirmar = document.getElementById('btn-confirmar');
    const btnCancelar = document.getElementById('btn-cancelar');
    


    // Cambiar módulo al hacer clic en la NavBar
    navLinks.forEach(link => {

        link.addEventListener('click', (e) => {

            e.preventDefault();
            moduloActivo = link.dataset.modulo;
            cargarModulo(moduloActivo);

        });

    });


    // Evento para abrir el modal de registro
    btnRegistrar.addEventListener('click', () => {

        modalFormulario.classList.remove('oculto');
        cargarCamposFormularioRegistro(moduloActivo);

    });


    // Cerrar el modal
    document.getElementById('btn-cerrar-modal').addEventListener('click', () => {

        modalFormulario.classList.add('oculto'); // Ocultar el modal

    });

    // Evento para enviar el formulario
    btnEnviar.addEventListener('click', (e) => {

        e.preventDefault();
        const formData = new FormData(document.getElementById('formulario-dinamico'));
        const jsonData = {};

        formData.forEach((value, key) => {

            jsonData[key] = value;

        });

        const id = jsonData.id_empleado || jsonData.id_producto;
        const url = `/api/${moduloActivo}`;
        const method = id ? 'PUT' : 'POST';
        const endpoint = id ? `${url}/${id}` : url;

        fetch(endpoint, {

            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)

        })
        .then(response => response.json())
        .then(data => {

            if (data.error) {

                mostrarModalError(data.error);

            } else {

                mostrarModalExito(data.mensaje || 'Operación realizada con éxito.');
                modalFormulario.classList.add('oculto');
                cargarModulo(moduloActivo); 

            }

        })
        .catch((error) => {

            console.error('Error:', error);
            mostrarModalError('Ha ocurrido un error. Por favor, inténtelo de nuevo.');

        });

    });

    // Función para mostrar el modal de éxito
    const mostrarModalExito = (mensaje) => {
        
        document.getElementById('mensaje-exito').textContent = mensaje;
        modalExito.classList.remove('oculto');

    };

    // Función para mostrar el modal de error
    const mostrarModalError = (mensaje) => {

        document.getElementById('mensaje-error').textContent = mensaje;
        modalError.classList.remove('oculto');

    };

    // Función para mostrar el modal de confirmación
    const mostrarModalConfirmacion = (id) => {

        modalConfirmacion.classList.remove('oculto');

        btnConfirmar.onclick = () => {

            eliminarRegistro(id);
            modalConfirmacion.classList.add('oculto');

        };

    };

    // Evento para cerrar los modales de éxito y error
    btnCerrarExito.addEventListener('click', () => {

        modalExito.classList.add('oculto');

    });

    btnCerrarError.addEventListener('click', () => {

        modalError.classList.add('oculto');

    });

    btnCancelar.addEventListener('click', () => {

        modalConfirmacion.classList.add('oculto');

    });


    // Función para eliminar un registro
    const eliminarRegistro = (id) => {

        fetch(`/api/${moduloActivo}/${id}`, {

            method: 'DELETE'

        })

        .then(response => response.json())
        .then(data => {

            console.log('Registro eliminado:', data);
            cargarModulo(moduloActivo);

        })

        .catch((error) => {

            console.error('Error al eliminar el registro:', error);
            mostrarModalError('Ha ocurrido un error al eliminar el registro. Por favor, inténtelo de nuevo.');

        });

    };


    // Función para cargar campos del formulario de registro
    const cargarCamposFormularioRegistro = (modulo) => {

        camposFormulario.innerHTML = ''; 

        if (modulo === 'empleados') {

            camposFormulario.innerHTML = `
                <label for="nombre" class="form-label">Nombre:</label>
                <input type="text" id="nombre" name="nombre" class="form-control" required>
                <label for="email" class="form-label">Email:</label>
                <input type="email" id="email" name="email" class="form-control" required>
                <label for="password" class="form-label">Contraseña:</label>
                <input type="password" id="password" name="password" class="form-control" required>
                <label for="rol" class="form-label">Rol:</label>
                <select id="rol" name="rol" class="form-select" required>
                    <option value="usuario">Usuario</option>
                    <option value="admin">Admin</option>
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

        // Agregar más módulos según sea necesario

    };

    // Función para cargar campos del formulario de edición
    const cargarCamposFormularioEdicion = (modulo, data) => {

        camposFormulario.innerHTML = '';

        if (modulo === 'empleados') {

            Object.keys(data).forEach((key) => {

                if (key === 'id') {

                    camposFormulario.innerHTML += `
                        <label for="${key}" class="form-label">${key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                        <input type="text" id="${key}" name="${key}" value="${data[key]}" class="form-control" readonly>
                    `;

                } else if (key === 'rol') {

                    camposFormulario.innerHTML += `
                        <label for="${key}" class="form-label">${key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                        <select id="${key}" name="${key}" class="form-select" required>
                            <option value="usuario" ${data[key] === 'usuario' ? 'selected' : ''}>Usuario</option>
                            <option value="admin" ${data[key] === 'admin' ? 'selected' : ''}>Admin</option>
                        </select>
                    `;

                } else if (key !== 'updated_at' && key !== 'created_at' && key !== 'password') {

                    camposFormulario.innerHTML += `
                        <label for="${key}" class="form-label">${key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                        <input type="text" id="${key}" name="${key}" value="${data[key]}" class="form-control" required>
                    `;

                }

            });

            // Agregar campo de contraseña con placeholder
            camposFormulario.innerHTML += `
                <label for="password" class="form-label">Contraseña:</label>
                <input type="password" id="password" name="password" placeholder="Escribir nueva contraseña" class="form-control">
            `;

        } else if (modulo === 'productos') {

            camposFormulario.innerHTML = `
                <label for="nombre">Nombre del producto:</label>
                <input type="text" id="nombre" name="nombre" value="${data.nombre}" required>
                <label for="cantidad">Cantidad:</label>
                <input type="number" id="cantidad" name="cantidad" value="${data.cantidad}" required>
                <label for="precio_unitario">Precio Unitario:</label>
                <input type="number" step="0.01" id="precio_unitario" name="precio_unitario" value="${data.precio_unitario}" required>
            `;

        }

        // Agregar más módulos según sea necesario

    };


    // Función para abrir el modal de edición
    const abrirModalEdicion = (id) => {

        fetch(`/api/${moduloActivo}/${id}`)
            .then(response => response.json())
            .then(data => {

                cargarCamposFormularioEdicion(moduloActivo, data);
                modalFormulario.classList.remove('oculto');

            })
            .catch(error => {

                console.error('Error al cargar los datos del registro:', error);
                mostrarModalError('Ha ocurrido un error al cargar los datos del registro. Por favor, inténtelo de nuevo.');

            });

    };

    window.abrirModalEdicion = abrirModalEdicion;
    window.mostrarModalConfirmacion = mostrarModalConfirmacion;

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

    empleados: ['id_empleado', 'nombre', 'email', 'rol'], 
    productos: ['id_producto', 'nombre', 'cantidad'],
    

};



const actualizarTabla = (data, modulo) => {

    const thead = document.querySelector('#tabla-datos thead');
    const tbody = document.querySelector('#tabla-datos tbody');

    
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
                    <button class="btn-primary" onclick="verDetalles(${idValor})">
                        <i class="fas fa-info-circle"></i>
                    </button>
                    <button class="btn-warning" onclick="abrirModalEdicion(${idValor})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-danger" onclick="mostrarModalConfirmacion(${idValor})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
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
