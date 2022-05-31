const { request, response } = require("express");
const Usuario = require('../models/usuario.model');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'El usuario y/o correo no son correctos - correo.'
            });
        }

        // Si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario y/o correo no son correctos - estado: false.'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'El usuario y/o password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);
        
        return res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el admnistrador'
        });
    }
};



const googleSignIn = async(req, res = response) => {

    const { id_token } = req.body;

    try {
        
        const { nombre, img, correo } = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            // Crear usuario
            const data = {
                nombre,
                correo,
                password: 'abc123',
                img,
                rol: 'USER_ROLE',
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador - Usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        });

    } catch (error) {

        return res.status(404).json({
            ok: false,
            msg: 'El Token no se pudo verificar'
        });

    }
};


module.exports = {
    login,
    googleSignIn
};