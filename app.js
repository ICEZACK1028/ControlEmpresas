'use strict'

//Variables Globales
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();

//Exportar 
module.exports = app;

//Rutas
const user_routes = require('./src/routes/users.routes');
const employee_routes = require('./src/routes/employees.routes');

//Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Cabeceras
app.use(cors());

//Carga de rutas
app.use('/api', user_routes, employee_routes);

//Exportación
module.exports = app;