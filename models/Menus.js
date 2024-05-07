const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    link: { type: String }, 
    slug : {type : String } ,
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menus', default: null },
    categoryId : { type: mongoose.Schema.Types.ObjectId, ref: 'Categories' , default: null},
    posision : {type : Number , default : 0} ,
});

const Menus = mongoose.model('Menus', menuSchema);

module.exports = Menus ;