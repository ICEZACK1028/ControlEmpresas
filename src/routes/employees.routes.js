'use strict'

//Importaciones
const express = require ('express');
const employeeController = require('../controllers/employee.controller');

//middleware
var md_authentication = require('../middlewares/authenndicated');

//Rutas
var api = express.Router();
api.post('/createEmployee', md_authentication.ensureAuth, employeeController.createEmployee);
api.put('/editEmployee/:idEmployee/:idCompany', md_authentication.ensureAuth, employeeController.editEmployee);
api.delete('/deleteEmployee/:idEmployee/:idCompany', md_authentication.ensureAuth, employeeController.deleteEmployee);

module.exports = api;
