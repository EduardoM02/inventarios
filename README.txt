# Sistema de Inventarios

Este es un sistema de gestión de inventarios que permite administrar empleados, productos, proveedores y movimientos de inventario. 
La aplicación está construida utilizando Node.js, Express y MySQL.

## Funcionalidades

### Empleados
- **Crear**: Permite agregar nuevos empleados al sistema.
- **Leer**: Muestra una lista de todos los empleados registrados.
- **Actualizar**: Permite editar la información de los empleados existentes.
- **Eliminar**: Permite eliminar empleados del sistema.

### Productos
- **Crear**: Permite agregar nuevos productos al inventario.
- **Leer**: Muestra una lista de todos los productos disponibles.
- **Actualizar**: Permite editar la información de los productos existentes.
- **Eliminar**: Permite eliminar productos del inventario.

### Proveedores
- **Crear**: Permite agregar nuevos proveedores al sistema.
- **Leer**: Muestra una lista de todos los proveedores registrados.
- **Actualizar**: Permite editar la información de los proveedores existentes.
- **Eliminar**: Permite eliminar proveedores del sistema.

### Movimientos
- **Crear**: Permite registrar movimientos de entrada y salida de productos.
- **Leer**: Muestra una lista de todos los movimientos registrados, incluyendo detalles del producto, empleado y proveedor.
- **Actualizar**: Permite editar la información de los movimientos existentes.
- **Eliminar**: Permite eliminar movimientos del sistema.

## Instalación

1. Clona el repositorio:
    ```sh
    git clone https://github.com/EduardoM02/inventarios.git
    ```

2. Navega al directorio del proyecto:
    ```sh
    cd inventarios
    ```

3. Instala las dependencias:
    ```sh
    npm install
    ```

4. Configura la base de datos MySQL:
    - Crea una base de datos llamada `inventariodb`.
    - Importa el archivo [inventariodb.sql](http://_vscodecontentref_/0) para crear las tablas necesarias.

5. Configura la conexión a la base de datos en el archivo [db.js](http://_vscodecontentref_/1).

## Uso

1. Inicia el servidor:
    ```sh
    npm start
    ```

2. Abre tu navegador y navega a `http://localhost:3000` para acceder a la aplicación.

## Autenticación

Para acceder al sistema, utiliza las siguientes credenciales de inicio de sesión:

- **Correo**: admin@admin
- **Contraseña**: admin

## Dependencias

- `bcryptjs`: Para encriptar contraseñas.
- [body-parser](http://_vscodecontentref_/2): Para parsear el cuerpo de las solicitudes.
- [cookie-parser](http://_vscodecontentref_/3): Para manejar cookies.
- [express](http://_vscodecontentref_/4): Framework web para Node.js.
- `jsonwebtoken`: Para manejar tokens JWT.
- `mysql2`: Para conectarse a la base de datos MySQL.
- `nodemon`: Para reiniciar automáticamente el servidor durante el desarrollo.

extra:
- `dotenv`: Para manejar los datos del archivo .env en el server

## Estructura del Proyecto

/inventarios/

    models/

        db.js : Conexión a base de datos
    
    public/

        index.html : Pagina principal donde se opera el sistema
        login.html : Pagina para iniciar sesión
        styles.css
        login.css

    rutas/

        auth.js 
        empleados.js
        movimientos.js
        productos.js
        proveedores.js

    package-lock.json
    package.json
    server.js
