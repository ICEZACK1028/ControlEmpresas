'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var EmployeeSchema = Schema({
    name: String,
    user: String,
    place: String,
    department: String,
    company: { type: Schema.Types.ObjectId, ref: 'users'}
});

module.exports = mongoose.model('employees', EmployeeSchema);
