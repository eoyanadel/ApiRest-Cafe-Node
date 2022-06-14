const { Router } = require('express');
const { check } = require('express-validator');
const { existeProductoById, existeCategoriaById } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/producto.controller');

const router = Router();

// Obtener todas las productos - público
router.get('/', obtenerProductos);

// Obtener un producto por id - público
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], obtenerProducto);

// Crear producto - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('categoria', 'No es un ID válido').isMongoId(),
    check('categoria').custom(existeCategoriaById),    
    validarCampos
], crearProducto);

// Actualizar producto - privado - cualquier persona con un token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoById),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('categoria', 'No es un ID válido').isMongoId(),
    check('categoria').custom(existeCategoriaById),
    validarCampos
], actualizarProducto);

// Borrar producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], borrarProducto);


module.exports = router;