'use strict'

//Importaciones
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'cangreburguer';

exports.createToken = function (user){
    var payload = {
        sub: user._id,
        user: user.user,
        iat: moment().unix(),
        exp: moment().day(20, 'days').unix()
    }

    return jwt.encode(payload, secret);

}
