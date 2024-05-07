const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title : {type : String , required : true} ,
    slug : {type : String } ,
    link  : {type : String} ,
    parent_id : {type : mongoose.Types.ObjectId , ref : "Categories" , default : null} ,
    children: [{ type: mongoose.Types.ObjectId, ref: 'Categories' }],
    news : [{type: mongoose.Types.ObjectId , ref: "News"}] 
})

const Categories = mongoose.model('Categories' , categorySchema);
module.exports = Categories ;
