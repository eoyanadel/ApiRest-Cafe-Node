const { Categoria, Role, Usuario, Producto } = require('../models');

const esRolValido = async(rol = '') => {
    
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
};

const emailExiste = async(correo = '') => {
    
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${ correo } ya está registrado`);
    }
};

const existeUsuarioById = async(id = '') => {

    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`No existe usuario con ese ID`);
    }
};

const existeCategoriaById = async(id = '') => {

    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error('No existe categoria con ese ID');
    }
};

const existeProductoById = async(id = '') => {

    const existeProducto = await Producto.findById(id);

    if (!existeProducto) {
        throw new Error('No existe producto con ese ID');
    }
};

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error(`La coleccion ${ coleccion } no es permitida: ${ colecciones }`);
    }

    return true;
};



module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioById,
    existeCategoriaById,
    existeProductoById,
    coleccionesPermitidas
};