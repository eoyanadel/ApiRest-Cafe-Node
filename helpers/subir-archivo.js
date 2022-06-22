const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {

        // archivo: nombre de la propiedad, es el archivo que se adjunta en la request        
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        
        // Validar la extension        
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${ extension } no es permitida, solo: ${ extensionesValidas }`);            
        }

        // genero nombre del archivo que es el id único que se genera con la librería npm uuidv4 + la extensión
        const nombreTemp = uuidv4() + '.' + extension;

        // genero ruta donde se guardará el archivo, __dirname: ruta del proyecto
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp);

        // guardo el archivo en la ruta, mv: mover
        archivo.mv(uploadPath, (err) => {
            if (err) {                
                reject(err);
            }

            resolve(nombreTemp);
        });

    });
    
};



module.exports = {
    subirArchivo
};