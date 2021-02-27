'use strict'

//Importaciones
const Employee = require('../models/employees.model');
const bcrypt = require ('bcrypt-nodejs');
const jwt = require ('../services/jwt');

//Crear empleados
function createEmployee(req,res){
    var employeeModel = new Employee();
    var params = req.body;
    
    if (params.user && params.name && params.department){
        employeeModel.user = params.user;
        employeeModel.name = params.name;
        employeeModel.place = params.place; 
        employeeModel.department = params.department;
        employeeModel.company = req.user.sub;

        employeeModel.save((er, newEmployee)=>{
            if(er) return res.status(500).send({ mensaje: 'Hubo un error en la creacion de empleado' });

            if(!newEmployee){
                return res.status(404).send({ mensaje: 'Algo ocurrió mal' });
            }else{
                return res.status(200).send({ newEmployee });
            }
        })
    }else{
        res.status(500).send({ mensaje: 'Se necesitan más datos para crear el empleado' });
    }

}

module.exports ={ 
    createEmployee
}