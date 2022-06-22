const express = require('express');
var cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config.db');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT; 
        
        this.path = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
            uploads: '/api/uploads'
        };              

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares (funciones que añaden funcionalidad al web server)
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS (Protege nuestro servidor)
        this.app.use(cors());

        // Lectura y parseo del body (en formato JSON)
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static('public'));

        // Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.path.auth, require('../routes/auth.routes'));
        this.app.use(this.path.buscar, require('../routes/buscar.routes'));
        this.app.use(this.path.categorias, require('../routes/categorias.routes'));
        this.app.use(this.path.productos, require('../routes/productos.routes'));
        this.app.use(this.path.usuarios, require('../routes/usuarios.routes'));
        this.app.use(this.path.uploads, require('../routes/uploads.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;