const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require('../models');


const cargarArchivo = async(req, res = response) => {

    try {
        // Imagenes
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        
        // txt, md
        // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');

        res.json({
        nombre
        });    
    } catch (msg) {
        res.status(400).json({ msg });
    }
};

// Subir una imagen al Server del repositorio del código
const actualizarImagen = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó implementar esto'});
    }

    // Limpiar imágenes previas
    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    // guardamos imagen en la carpeta correspondiente a la coleccion
    const nombre = await subirArchivo(req.files, undefined, coleccion);
    
    // Yo se que tanto mi modelo de Usuario como Producto poseen una propiedad llamada img, a la cual le asigno el nombre de la imagen guardada en el server
    modelo.img = nombre;

    // actualizamos en BD ruta de la imagen
    await modelo.save();


    res.json(modelo);
};

// Subir una imagen a Cloudinary
const actualizarImagenCloudinary = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó implementar esto'});
    }

    // Limpiar imágenes previas
    if (modelo.img) {
        // Hay que borrar la imagen de cloudinary

        // la imagen es una url de cloudinary donde la parte final es el nombre de la imagen
        // ejemplo: https://res.cloudinary.com/ddw70x20e/image/upload/v1655936443/ggkbwt2chos5gnw9gnof.png
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];

        // el nombre de la imagen es denominada por cloudinary como public_id, por eso desestructuro el nombre de la imagen con ese nombre de variable
        const [ public_id ] = nombre.split('.');

        // borramos imagen desde cloudinary
        await cloudinary.uploader.destroy(public_id);
    }

    // tempFilePath es la ruta temporal de mi archivo, el cual viene en la request
    const { tempFilePath } = req.files.archivo;

    // la resp de cloudinary es un objeto con muchas propiedadess, dentro de esas propiedades está la secure_url que corresponde a la url de la imagen guardada en cloudinary
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        
    // Yo se que tanto mi modelo de Usuario como Producto poseen una propiedad llamada img, a la cual le asigno la url de la imagen guardada en cloudinary
    modelo.img = secure_url;

    // actualizamos en BD ruta de la imagen
    await modelo.save();


    res.json(modelo); 
};


const mostrarImagen = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó implementar esto'});
    }

    // si el modelo tiene seteada la imagen en BD
    if (modelo.img) {        
        // armamos ruta del server donde se guarda la imagen
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);        
        // si la imagen existe en el server, la mandamos de vuelta
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    const pathImageNotFound = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImageNotFound);
    
};



module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
};