'use strict'

const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const app = require("./app");
const Employees = require("./src/models/employee.model");
const Factorys = require("./src/models/factory.model");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/EmpresasDB', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log('Conexion establecida');


    app.listen(3000, function(){
        console.log('Todo funcionando al 100%, ¡Crack!');
    })

}).catch(er => console.log(er));

