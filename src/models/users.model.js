'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var UserSchema = Schema({
    user: String, 
    password: String,
});

module.exports = mongoose.model('users', UserSchema);
