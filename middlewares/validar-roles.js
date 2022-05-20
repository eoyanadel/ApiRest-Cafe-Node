const { response } = require("express");


const esAdminRole = (req, res = response, next) => {

    // EL usuario autenticado se guarda en la request en el middleware de validar-jwt    

    if (!req.usuarioAutenticado) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        });
    }

    const { rol, nombre } = req.usuarioAutenticado;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${ nombre } no es administrador - No puede hacer esto`
        });
    }

    next();
};


const tieneRole = (...roles) => {

    return (req, res = response, next) => {

        if (!req.usuarioAutenticado) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            });
        }

        if (!roles.includes(req.usuarioAutenticado.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${ roles }`
            });
        }

        next();
    };
};


module.exports = {
    esAdminRole,
    tieneRole
};