const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
    id_new : {type : String} ,
    title       : {type : String , required : true} ,
    description : {type : String , required : true} ,
    link : {type : String } ,
    slug : {type : String },
    content : {type : String } ,
    author : {type : String },
    image : {type : String , default : ''} ,
    category_id : {type : mongoose.Types.ObjectId , ref : 'Categories'} ,
    tags : [{type : mongoose.Types.ObjectId , ref : 'Tags'}] ,    
    published_at  : {type : Date , default : Date.now()},
    comments : [{type : mongoose.Types.ObjectId , ref : 'Comments'}]
})

newSchema.index({title : "text"}); ;

const News = mongoose.model('News' , newSchema);
module.exports = News ;
