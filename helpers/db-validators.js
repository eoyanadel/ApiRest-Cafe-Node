const Role = require('../models/role.model');
const Usuario = require('../models/usuario.model');

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


module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioById
};