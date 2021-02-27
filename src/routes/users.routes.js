'use strict'

//Importaciones
const express = require('express');
const userController = require('../controllers/user.controller');

//Middlewares
const md_authentication = require('../middlewares/authenndicated');

//Rutas
var api = express.Router();
api.post('/createCompany', md_authentication.ensureAuth, userController.createUser);
api.get('/getUser', userController.getUser);
api.post('/login', userController.Login );
api.put('/userUpdate/:idUser',md_authentication.ensureAuth, userController.editUser );
api.delete('/userDelete/:idUser', md_authentication.ensureAuth, userController.deleteUser);



module.exports = api;