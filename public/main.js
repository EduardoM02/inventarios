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

        let id;

        switch (moduloActivo) {

            case 'movimientos':
                id = jsonData.id_movimiento;
                break;

            case 'empleados':
                id = jsonData.id_empleado;
                break;

            case 'productos':
                id = jsonData.id_producto;
                break;

            case 'proveedores':
                id = jsonData.id_proveedor;
                break;

            default:

                id = null;

        }
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

            if (data.error) {

                mostrarModalError(data.error);

            } else {

                console.log('Registro eliminado:', data);
                cargarModulo(moduloActivo);

            }

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
                <label for="nombre" class="form-label">Nombre del producto:</label>
                <input type="text" id="nombre" name="nombre" class="form-control" required>
                <label for="sku" class="form-label">SKU:</label>
                <input type="text" id="sku" name="sku" class="form-control" required>
                <label for="cantidad" class="form-label">Cantidad:</label>
                <input type="number" id="cantidad" name="cantidad" class="form-control" required>
                <label for="precio_unitario" class="form-label">Precio Unitario:</label>
                <input type="number" step="0.01" id="precio_unitario" name="precio_unitario" class="form-control" required>
                <label for="ubicacion" class="form-label">Ubicación:</label>
                <select id="ubicacion" name="ubicacion" class="form-select" required>
                    <option values="Recepcion">Recepción</option>
                    <option values="Almacen">Almacén</option>
                    <option values="Preparacion">Preparación</option>
                    <option values="Embalaje">Embalaje</option>
                    <option values="Expedicion">Expedición</option>
                </select>
                <label for="proveedor" class="form-label">Proveedor:</label>
                <select id="proveedor" name="proveedor" class="form-select" required>
                   
                </select>
            `;
            
            cargarProveedores();

        } else if (modulo === 'proveedores') {

            camposFormulario.innerHTML = `
                <label for="nombre" class="form-label">Nombre:</label>
                <input type="text" id="nombre" name="nombre" class="form-control" required>
                <label for="contacto" class="form-label">Persona de contacto:</label>
                <input type="text" id="contacto" name="contacto" class="form-control" required>
                <label for="telefono" class="form-label">Teléfono:</label>
                <input type="tel" id="telefono" name="telefono" class="form-control" required>
                <label for="email" class="form-label">Email:</label>
                <input type="email" id="email" name="email" class="form-control" required>
                <label for="direccion" class="form-label">Dirección:</label>
                <input type="text" id="direccion" name="direccion" class="form-control" required>
            `;

        } else if (modulo === 'movimientos') {

            camposFormulario.innerHTML = `
            <label for="id_producto" class="form-label">Producto:</label>
            <select id="id_producto" name="id_producto" class="form-select" required>
                <!-- Productos se llenarán dinámicamente -->
            </select>
            <label for="tipo" class="form-label">Tipo:</label>
            <select id="tipo" name="tipo" class="form-select" required>
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
            </select>
            <label for="cantidad" class="form-label">Cantidad:</label>
            <input type="number" id="cantidad" name="cantidad" class="form-control" required>
            <label for="id_empleado" class="form-label">Empleado Responsable:</label>
            <select id="id_empleado" name="id_empleado" class="form-select" required>
                <!-- Empleados se llenarán dinámicamente -->
            </select>
                <label for="proveedor" class="form-label">Proveedor:</label>
                <select id="proveedor" name="id_proveedor" class="form-select">
                    <!-- Proveedores se llenarán dinámicamente -->
                </select>
            <label for="motivo" class="form-label">Motivo:</label>
            <textarea id="motivo" name="motivo" class="form-control" required></textarea>
            `;

            cargarProductos();
            cargarEmpleados();
            cargarProveedores();

            document.getElementById('tipo').addEventListener('change', (e) => {

                const proveedorContainer = document.getElementById('proveedor');

                if (e.target.value === 'entrada') {

                    proveedorContainer.style.display = 'block';

                } else {

                    proveedorContainer.style.display = 'none';

                }

            });

            document.getElementById('tipo').dispatchEvent(new Event('change'));

        }

    };

    const cargarCamposFormularioEdicion = (modulo, data) => {

        camposFormulario.innerHTML = '';
    
        if (modulo === 'empleados') {

            Object.keys(data).forEach((key) => {

                if (key === 'id_empleado') {

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
    
            camposFormulario.innerHTML += `
                <label for="password" class="form-label">Contraseña:</label>
                <input type="password" id="password" name="password" placeholder="Escribir nueva contraseña" class="form-control">
            `;

        } else if (modulo === 'productos') {

            camposFormulario.innerHTML = `
                <label for="id_producto" class="form-label">ID:</label>
                <input type="text" id="id_producto" name="id_producto" value="${data.id_producto}" class="form-control" readonly>
                <label for="nombre" class="form-label">Nombre del producto:</label>
                <input type="text" id="nombre" name="nombre" value="${data.nombre}" class="form-control" required>
                <label for="sku" class="form-label">SKU:</label>
                <input type="text" id="sku" name="sku" value="${data.sku}" class="form-control" required>
                <label for="cantidad" class="form-label">Cantidad:</label>
                <input type="number" id="cantidad" name="cantidad" value="${data.cantidad}" class="form-control" required>
                <label for="precio_unitario" class="form-label">Precio Unitario:</label>
                <input type="number" step="0.01" id="precio_unitario" name="precio_unitario" class="form-control" value="${data.precio_unitario}" required>
                <label for="ubicacion" class="form-label">Ubicación:</label>
                <select id="ubicacion" name="ubicacion" class="form-select" required>
                    <option value="Recepcion" ${data.ubicacion === 'Recepcion' ? 'selected' : ''}>Recepción</option>
                    <option value="Almacen" ${data.ubicacion === 'Almacen' ? 'selected' : ''}>Almacén</option>
                    <option value="Preparacion" ${data.ubicacion === 'Preparacion' ? 'selected' : ''}>Preparación</option>
                    <option value="Embalaje" ${data.ubicacion === 'Embalaje' ? 'selected' : ''}>Embalaje</option>
                    <option value="Expedicion" ${data.ubicacion === 'Expedicion' ? 'selected' : ''}>Expedición</option>
                </select>
                <label for="proveedor" class="form-label">Proveedor:</label>
                <select id="proveedor" name="proveedor" class="form-select" required>
                    <!-- Proveedores se llenarán dinámicamente -->
                </select>
            `;

            cargarProveedores(data.id_proveedor); // Llamar a la función para cargar los proveedores y seleccionar el actual

        } else if (modulo === 'proveedores') {

            Object.keys(data).forEach((key) => {

                if (key === 'id_proveedor') {

                    camposFormulario.innerHTML += `
                        <label for="${key}" class="form-label">${key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                        <input type="text" id="${key}" name="${key}" value="${data[key]}" class="form-control" readonly>
                    `;

                } else if (key !== 'updated_at' && key !== 'created_at') {

                    camposFormulario.innerHTML += `
                        <label for="${key}" class="form-label">${key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                        <input type="text" id="${key}" name="${key}" value="${data[key]}" class="form-control" required>
                    `;

                }

            });

        } else if (modulo === 'movimientos') {

            camposFormulario.innerHTML = `
            <label for="id_movimiento" class="form-label">ID:</label>
            <input type="text" id="id_movimiento" name="id_movimiento" value="${data.id_movimiento}" class="form-control" readonly>
            <label for="id_producto" class="form-label">Producto:</label>
            <select id="id_producto" name="id_producto" class="form-select" required>
                <!-- Productos se llenarán dinámicamente -->
            </select>
            <label for="tipo" class="form-label">Tipo:</label>
            <select id="tipo" name="tipo" class="form-select" required>
                <option value="entrada" ${data.tipo === 'entrada' ? 'selected' : ''}>Entrada</option>
                <option value="salida" ${data.tipo === 'salida' ? 'selected' : ''}>Salida</option>
            </select>
            <label for="cantidad" class="form-label">Cantidad:</label>
            <input type="number" id="cantidad" name="cantidad" value="${data.cantidad}" class="form-control" required>
            <label for="id_empleado" class="form-label">Empleado Responsable:</label>
            <select id="id_empleado" name="id_empleado" class="form-select" required>
                <!-- Empleados se llenarán dinámicamente -->
            </select>
            <div id="proveedor-container">
                <label for="proveedor" class="form-label">Proveedor:</label>
                <select id="proveedor" name="id_proveedor" class="form-select">
                    <!-- Proveedores se llenarán dinámicamente -->
                </select>
            </div>
            <label for="motivo" class="form-label">Motivo:</label>
            <textarea id="motivo" name="motivo" class="form-control" required>${data.motivo}</textarea>
            `;

            cargarProductos(data.id_producto);
            cargarEmpleados(data.id_empleado);
            cargarProveedores(data.id_proveedor);

            document.getElementById('tipo').addEventListener('change', (e) => {

                const proveedorContainer = document.getElementById('proveedor-container');

                if (e.target.value === 'entrada') {

                    proveedorContainer.style.display = 'block';

                } else {

                    proveedorContainer.style.display = 'none';

                }

            });

            document.getElementById('tipo').dispatchEvent(new Event('change'));

        }

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


     // Función para cargar los proveedores y llenar el select
    const cargarProveedores = (selectedProveedorId) => {

        fetch('/api/proveedores')

            .then(response => response.json())
            .then(data => {

                const selectProveedor = document.getElementById('proveedor');

                selectProveedor.innerHTML = ''; // Limpiar opciones existentes

                data.forEach(proveedor => {

                    const option = document.createElement('option');
                    option.value = proveedor.id_proveedor;
                    option.textContent = proveedor.nombre;

                    if (proveedor.id_proveedor === selectedProveedorId) {

                        option.selected = true;

                    }

                    selectProveedor.appendChild(option);

                });

            })
            .catch(error => {

                console.error('Error al cargar los proveedores:', error);
                mostrarModalError('Ha ocurrido un error al cargar los proveedores. Por favor, inténtelo de nuevo.');
            
            });
    };


    const cargarProductos = () => {

        fetch('/api/productos')

            .then(response => response.json())
            .then(data => {

                const selectProducto = document.getElementById('id_producto');
                selectProducto.innerHTML = ''; // Limpiar opciones existentes
                
                data.forEach(producto => {

                    const option = document.createElement('option');
                    option.value = producto.id_producto;
                    option.textContent = producto.nombre;
                    selectProducto.appendChild(option);

                });

            })
            .catch(error => {

                console.error('Error al cargar los productos:', error);
                mostrarModalError('Ha ocurrido un error al cargar los productos. Por favor, inténtelo de nuevo.');
            
            });

    };


    const cargarEmpleados = () => {

        fetch('/api/empleados')

            .then(response => response.json())
            .then(data => {

                const selectEmpleado = document.getElementById('id_empleado');
                selectEmpleado.innerHTML = ''; // Limpiar opciones existentes

                data.forEach(empleado => {

                    const option = document.createElement('option');
                    option.value = empleado.id_empleado;
                    option.textContent = empleado.nombre;
                    selectEmpleado.appendChild(option);

                });

            })
            .catch(error => {

                console.error('Error al cargar los empleados:', error);
                mostrarModalError('Ha ocurrido un error al cargar los empleados. Por favor, inténtelo de nuevo.');
            
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
    productos: ['id_producto', 'sku', 'nombre', 'cantidad', 'precio_unitario'],
    proveedores: ['id_proveedor', 'nombre', 'email', 'telefono'],
    movimientos: ['id_movimiento', 'id_producto', 'fecha', 'tipo', 'cantidad']

};



const actualizarTabla = (data, modulo) => {

    const thead = document.querySelector('#tabla-datos thead');
    const tbody = document.querySelector('#tabla-datos tbody');

    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (data.length === 0) {

        tbody.innerHTML = '<tr><td colspan="5">No hay registros disponibles</td></tr>';
        return;

    }

    const campos = camposAMostrar[modulo] || Object.keys(data[0]);

    const headerRow = campos.map((campo) => `<th>${campo.charAt(0).toUpperCase() + campo.slice(1)}</th>`).join('');
    thead.innerHTML = `<tr>${headerRow}<th>Acciones</th></tr>`;

    data.forEach((item) => {

        const idCampo = campos.find(campo => campo.includes('id')) || 'id';
        const idValor = item[idCampo];

        const row = campos.map((campo) => {

            if (campo === 'id_proveedor' && item['nombre_proveedor']) {

                return `<td>${item['nombre_proveedor']}</td>`;

            } else if (campo === 'id_empleado' && item['nombre_empleado']) {

                return `<td>${item['nombre_empleado']}</td>`;

            } else if (campo === 'id_producto' && item['nombre_producto']) {

                return `<td>${item['nombre_producto']}</td>`;

            } else {

                return `<td>${item[campo] || ''}</td>`;

            }

        }).join('');

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

                if (key === 'id_proveedor' && data['nombre_proveedor']) {

                    detallesContenido.innerHTML += `
                        <p><strong>Proveedor:</strong> ${data['nombre_proveedor']}</p>
                    `;

                } else if (key === 'id_empleado' && data['nombre_empleado']) {

                    detallesContenido.innerHTML += `
                        <p><strong>Empleado:</strong> ${data['nombre_empleado']}</p>
                    `;

                } else if (key === 'id_producto' && data['nombre_producto']) {

                    detallesContenido.innerHTML += `
                        <p><strong>Producto:</strong> ${data['nombre_producto']}</p>
                    `;

                } else {

                    detallesContenido.innerHTML += `
                        <p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${data[key]}</p>
                    `;

                }

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
