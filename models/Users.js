const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : {type : String } ,
    email : {type : String } , 
    password : {type : String } , 
    role : {type : Number} ,
})

const Users = mongoose.model('Users' , UserSchema);
module.exports = Users ;
