'use strict'

const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const app = require("./app");
const User = require("./src/models/users.model");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/EmpresasDB', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log('Conexión establecida');

    var userConst = new User();
    var userName = 'Admin';
    var password = '123456';

    userConst.user = userName;
    userConst.password = password;

    User.find({ user: userConst.user }).exec((er, userFound)=>{
        if(userFound && userFound.length >= 1 ){
            return console.log('Ya fue creado el usuario admin');
        }else{
            bcrypt.hash(password, null, null, (er, PassCrypt)=>{

                userConst.password = PassCrypt;
                userConst.save((er, userSaved)=>{
                    if(er) return res.status(500).send({ mensaje: 'Error al guardar el usuario admin' });
                    if(userSaved){
                        return console.log(userSaved);
                    }else{
                        return res.status(400).send({mensaje: 'No se ha podido crear el usuario admin'});
                    }
                })
            })
        }
    })

    app.listen(3000, function(){
        console.log('Todo anda bien acá en la zona 3000');
    })

}).catch(er => console.log(er));

