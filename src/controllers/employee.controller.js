'use strict'

//Importaciones
const Employee = require('../models/employees.model');
const PDF = require('html-pdf');

//Crear empleados
function createEmployee(req,res){
    var employeeModel = new Employee();
    var params = req.body;

    //Verficar si es una empresa la que quiere crear
    if(req.user.user === 'Admin') return res.status(500).send({ mensaje: 'Sólo las empresas puede crear empleados' });

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

//Buscar empleados por ID
function searchEmployeeID(req,res){
    var idEmployee = req.params.idEmployee;

    //Verificar que sea una empresa
    if(req.user.user === 'Admin') return res.status(500).send({ mensaje: 'Solo las empresas pueden buscar empleados'});

    Employee.findById(idEmployee, (er, employeeFound)=>{
        if(er) return res.status(500).send({ mensaje: 'Ocurrio un error en el proceso' });
        if(!employeeFound) return res.status(500).send({ mensaje: 'No se ha podido encontrar el Empleado, revisa el id' });
        //Verificar que el usuario buscado pertenezca a su empresa
        if( req.user.sub != employeeFound.company) return res.status(500).send({ mensaje: 'Este empleado no se encuentra en su empresa' });
        return res.status(200).send({ 'Empleado': employeeFound });
    })

}

//Buscar empleados por nombre
function searchEmployeeName(req, res){
    var nameEmployee = req.params.nameEmployee;

    //Verificar que sea una empresa
    if(req.user.user === 'Admin') return res.status(500).send({ mensaje: 'Solo las empresas pueden buscar empleados'});
    
    Employee.find({name: nameEmployee, company: req.user.sub}, (er, employeeFound)=>{
        if(er) return res.status(500).send({ mensaje: 'Error en el proceso' });
        if(!employeeFound) return res.status(500).send({ mensaje: 'No se ha encontrado ningún empleado con ese nombre' });
        return res.status(200).send({ 'Empleado': employeeFound });
    });
}

//Buscar empleados por departamento
function searchEmployeeDepartment(req, res){
    var depEmployee = req.params.depEmployee;

    //Verificar que sea una empresa
    if(req.user.user === 'Admin') return res.status(500).send({ mensaje: 'Solo las empresas pueden buscar empleados'});
    
    Employee.find({department: depEmployee, company: req.user.sub}, (er, employeeFound)=>{
        if(er) return res.status(500).send({ mensaje: 'Error en el proceso' });
        if(!employeeFound) return res.status(500).send({ mensaje: 'No se ha encontrado ningún empleado en ese departamento' });
        return res.status(200).send({ 'Empleado': employeeFound });
    });
}

//Buscar todos los empleados
function searchEmployeeAll(req, res){
     //Verificar que sea una empresa
    if(req.user.user === 'Admin') return res.status(500).send({ mensaje: 'Solo las empresas pueden buscar empleados'});
     
    Employee.find({company: req.user.sub}, (er, userFound)=>{
        if(er) return res.status(500).send({ mensaje: 'Error en la petición' });
        if(!userFound) return res.status(500).send({ mensaje: 'Error en la consulta' });
        return res.status(200).send({  userFound });
    })
}

//Editar empleados
function editEmployee(req, res){
    var idEmployee = req.params.idEmployee;
    var params = req.body;

    //evitar que se pueda editar el campo usuario
    delete params.user;

    //Verificar que sea una empresa
    if(req.user.user === 'Admin') return res.status(500).send({ mensaje: 'Solo las empresas pueden editar los empleados'});

    Employee.findByIdAndUpdate(idEmployee, params, { new: true, useFindAndModify:false }, (er, userUpdated)=>{
        if(er) return res.status(500).send({ mensaje: 'Ha ocurrido un error en el proceso'});
        if(!userUpdated) return res.status(500).send({ mensaje: 'No se ha encontrado ningún empleado con ese id' });
        //Verificar que el empleado sea de su empresa
        if(req.user.sub != userUpdated.company) return res.status(500).send({ mensaje: 'Este empleado no se encuentra en su empresa' });
        return res.status(200).send ({ 'Usuario actualizado': userUpdated });
    })

}

//Eliminar Empleados
function deleteEmployee(req, res){
    var idEmployee = req.params.idEmployee;
    var idCompany = req.params.idCompany;

    //Verificar que sea una empresa
    if(req.user.user === 'Admin') return res.status(500).send({ mensaje: 'Solo las empresas tienen permiso para eliminar empleados'})

    
    Employee.findByIdAndDelete(idEmployee, (er, userDeleted)=>{
        if(er) return res.status(500).send({ mensaje: 'Ha surgido un error'})
        if(!userDeleted) return res.status(500).send({ mensaje: 'No se ha encontrado ningún empleado con ese Id' });
        //Verificar que el empleado pertenezca a la empresa
        if(req.user.sub != userDeleted.company) return res.status(500).send({ mensaje: 'Este empleado no existe en su empresa' })
        return res.status(200).send({ 'Empleado eliminado': userDeleted });
    })
}

//Creación del pdf
function createEmployeePDF(req, res){
    var idEmployee = req.user.sub;

    //Evaluar las empresas
    if(req.user.user === 'Admin') return res.status(500).send({ mensaje: 'Solo las empresas pueden generar pdf' });
    
        Employee.find({company: req.user.sub}, (er, employees)=>{
            if(er) return res.status(500).send({ mensaje: 'Error en la petición' });
            if(!employees) return res.status(500).send({ mensaje: 'Error en la consulta' });
                
                var employeesCompany = [];

                employees.forEach(element =>{
                    employeesCompany.push(element)
                });

                const pdfEmployees = `
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
                    <link rel="preconnect" href="https://fonts.gstatic.com">
                    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@1,100&display=swap" rel="stylesheet">
                    <body>
                        <div class="position-relative container" style="font-family: 'Roboto', sans-serif; margin= 30px;">
                            <h1 class="text-center" style="margin-top: 50px; margin-bottom: 30px" ><strong>Empleados de ${req.user.user}</strong></h1>
                            <table class="table" style="margin-left:50px;  width: 90%">
                                <thead>
                                    <tr class="">
                                        <th scope="col"><strong>Usuario</strong></th>
                                        <th scope="col"><strong>Nombre</strong></th>
                                        <th scope="col"><strong>Puesto</strong></th>
                                        <th scope="col"><strong>Departamento</strong></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${employeesCompany.map(objects => `
                                        <tr>
                                            <td>${objects.user}</td>
                                            <td>${objects.name}</td>
                                            <td>${objects.place}</td>
                                            <td>${objects.department}</td>
                                        </tr> `).join('').replace(/['"{}']+/g,'')} 
                                </tbody>
                            </table>
                        </div>
                    </body>`;

                PDF.create(pdfEmployees).toFile('./src/node-pdf/EmployeesPDF.pdf', function(er, res) {
                    if (er){
                        console.log(er);
                    } else {
                        console.log(res);
                    }
                });
            return res.status(200).send({ mensaje: 'Creando pdf...'});
        })
}

module.exports ={ 
    createEmployee,
    editEmployee,
    deleteEmployee,
    searchEmployeeID,
    searchEmployeeName,
    searchEmployeeDepartment,
    searchEmployeeAll,
    createEmployeePDF
}
