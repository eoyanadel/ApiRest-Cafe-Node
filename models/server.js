const express = require('express');
var cors = require('cors');
const { dbConnection } = require('../database/config.db');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

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
    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/usuarios.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;