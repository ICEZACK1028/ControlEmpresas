'use strict'

//Importaciones
const User = require('../models/users.model');
const bcrypt = require ('bcrypt-nodejs');
const jwt = require('../services/jwt');



//Función para loguearse
function Login (req, res){
    var params = req.body;
    User.findOne({ user: params.user }, (er, userFound)=>{
        if(er) return res.status(500).send({ mensaje: 'Error en la petición' });

        if(userFound){
            bcrypt.compare(params.password, userFound.password, (er, PassCrypt)=>{
                if(PassCrypt){
                    if(params.getToken === 'true'){
                        return res.status(200).send({
                            Token: jwt.createToken(userFound)
                        });
                    }else{
                        userFound.password = undefined;
                        return res.status(200).send({ userFound });
                    }
                }else{
                    return res.status(404).send({ mensaje: 'El usuario no se ha podido identificar' });
                }
            })
        }else{
            return res.status(404).send({ mensaje: 'El usuario no ha podido ingresar' });
        }
    })
}

//Función para que el admin cree una empresa
function createUser(req, res){
    var userModel = new User();
    var params = req.body;

     if(req.user.user != 'Admin') return res.status(500).send({ mensaje: 'Solo el admin puede crear empresas' });

        if(params.user && params.password){
            userModel.user = params.user;

            User.find({ user: userModel.user }).exec((er, userFound)=>{
                if (er) return res.status(500).send({ mensaje: 'Error al encontrar el usuario' });

                if(userFound && userFound.length >=1){
                    return res.status(500).send({ mensaje: 'Ya existe una empresa con el mismo usuario'});
                }else{
                    bcrypt.hash(params.password, null, null, (er, PassCrypt)=>{
                        userModel.password = PassCrypt;

                        userModel.save((er, userSaved)=>{
                            if(userSaved){
                                res.status(300).send(userSaved);
                            }else{
                                res.status(404).send({ mensaje: 'No se ha podido registrar la empresa' });
                            }
                        })
                    })
                }
            })
        }
}

//Obtener empresas
function getUser(req, res){
    // var params = req.body;
    // if(params.user.rol != 'Admin') return res.status(500).send({ mensaje: 'Usted no tiene acceso a las empresas' });
    User.find((er,userFound)=>{
        if(er) return res.status(500).send({ mensaje: 'Error en la petición' });
        if(!userFound) return res.status(500).send({ mensaje: 'Error en la consulta' });
        return res.status(200).send({  userFound });
    })
}

//Editar Empresas
function editUser(req, res){
    var idUser = req.params.idUser;
    var params = req.body;

    // evita que se pueda editar la contraseña
    delete params.password;

    //Evaluar si es el Admin
    if(req.user.user != 'Admin') return res.status(500).send({ mensaje: 'Únicamente el Admin puede editar las empresas' });
    
    User.findByIdAndUpdate(idUser, params, { new: true, useFindAndModify: false }, (er, userUpdated)=>{
        if(er)  return res.status(500).send({ mensaje: 'Error en la petición' });
        if(!userUpdated) return res.status(500).send({ mensaje: 'No se pudo actualizar el usuario' });
        return res.status(200).send({ userUpdated })
    })
}

//Eliminar Empresas
function deleteUser(req,res){
    var idUser = req.params.idUser;

    //valicación de admin
    if(req.user.user != 'Admin') return res.status(500).send({ mensaje: 'Únicamente el Admin puede eliminar empresas' });

    User.findByIdAndDelete(idUser, (er, deleteUser)=>{
        if(er) return res.status(500).send({ mensaje:'Error en el proceso' });
        if(!deleteUser) return res.status(500).send({ mensaje: 'No se ha encontrado la empresa, verifique el Id' })
        return res.status(200).send({ 'Empresa eliminada': deleteUser });
    })

}




module.exports = {
    createUser,
    getUser,
    Login,
    editUser,
    deleteUser,
}