'use strict'

//Importaciones
const express = require ('express');
const employeeController = require('../controllers/employee.controller');

//middleware
var md_authentication = require('../middlewares/authenndicated');

//Rutas
var api = express.Router();
api.post('/createEmployee', md_authentication.ensureAuth, employeeController.createEmployee);
api.put('/editEmployee/:idEmployee', md_authentication.ensureAuth, employeeController.editEmployee);
api.delete('/deleteEmployee/:idEmployee', md_authentication.ensureAuth, employeeController.deleteEmployee);
api.get('/getEmployeeID/:idEmployee', md_authentication.ensureAuth, employeeController.searchEmployeeID);
api.get('/getEmployeeName/:nameEmployee', md_authentication.ensureAuth, employeeController.searchEmployeeName);
api.get('/getEmployeeDepartment/:depEmployee', md_authentication.ensureAuth, employeeController.searchEmployeeDepartment);
api.get('/getEmployeeAll', md_authentication.ensureAuth, employeeController.searchEmployeeAll);
api.get('/createEmployeePDF',md_authentication.ensureAuth, employeeController.createEmployeePDF);

module.exports = api;
