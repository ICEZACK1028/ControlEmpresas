'use strict'

//Importaciones
const Employee = require('../models/employees.model');
const bcrypt = require ('bcrypt-nodejs');
const jwt = require ('../services/jwt');
const { findByIdAndUpdate } = require('../models/employees.model');

//Crear empleados
function createEmployee(req,res){
    var employeeModel = new Employee();
    var params = req.body;

    //Verficar si es una empresa la que quiere crear
    if(req.user.rol === 'ROL_ADMIN') return res.status(500).send({ mensaje: 'Sólo las empresas puede crear empleados' });

    //Verificar si han llenado los campos
    if (params.user && params.name && params.department){
        employeeModel.user = params.user;
        employeeModel.name = params.name;
        employeeModel.place = params.place; 
        employeeModel.department = params.department;
        employeeModel.company = req.user.sub;

        //Verificar que no creen un empleado con el mismo usuario
        Employee.find({ user: employeeModel.user }).exec((er, userFound)=>{
            if(userFound && userFound.length >=1){
                return res.status(500).send({mensaje:`El usuario ${params.user} ya está en uso. Prueba con otro`})
            }else{
                //Guardar el nuevo empleado
                employeeModel.save((er, newEmployee)=>{
                    if(er) return res.status(500).send({ mensaje: 'Hubo un error en la creacion de empleado' });
        
                    if(!newEmployee){
                        return res.status(404).send({ mensaje: 'Algo ocurrió mal' });
                    }else{
                        return res.status(200).send({ 'Datos Empleado': newEmployee });
                    }
                })
            }
        })
        }else{
            res.status(500).send({ mensaje: 'Se necesitan más datos para crear el empleado' });
    }
}

//Buscar empleados
function searchEmployee(req,res){
    var idEmployee = req.params.idEmployee;


}

//Editar empleados
function editEmployee(req, res){
    var idEmployee = req.params.idEmployee;
    var idCompany = req.params.idCompany;
    var params = req.body;

    //evitar que se pueda editar el campo usuario
    delete params.user;

    //Verificar que sea una empresa
    if(req.user.rol === 'ROL_ADMIN') return res.status(500).send({ mensaje: 'Solo las empresas pueden editar los empleados'});

    //Verificar que el empleado sea de su empresa
    if(req.user.sub != idCompany) return res.status(500).send({ mensaje: 'Este empleado no se encuentra en su empresa' });

    Employee.findByIdAndUpdate(idEmployee, params, { new: true, useFindAndModify:false }, (er, userUpdated)=>{
        if(er) return res.status(500).send({ mensaje: 'Ha ocurrido un error en el proceso'});
        if(!userUpdated) return res.status(500).send({ mensaje: 'No se ha encontrado ningún empleado con ese id' });
        return res.status(200).send ({ 'Usuario actualizado': userUpdated });
    })

}

//Eliminar Empleados
function deleteEmployee(req, res){
    var idEmployee = req.params.idEmployee;
    var idCompany = req.params.idCompany;

    //Verificar que sea una empresa
    if(req.user.rol === 'ROL_ADMIN') return res.status(500).send({ mensaje: 'Solo las empresas tienen permiso para eliminar empleados'})

    //Verificar que el empleado pertenezca a la empresa
    if(req.user.sub != idCompany) return res.status(500).send({ mensaje: 'Este empleado no existe en su empresa' })

    Employee.findByIdAndDelete(idEmployee, (er, userDeleted)=>{
        if(er) return res.status(500).send({ mensaje: 'Ha surgido un error'})
        if(!userDeleted) return res.status(500).send({ mensaje: 'No se ha encontrado ningún empleado con ese Id' });
        return res.status(200).send({ 'Empleado eliminado': userDeleted });
    })
}

//

module.exports ={ 
    createEmployee,
    editEmployee,
    deleteEmployee
}