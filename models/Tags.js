const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    title : {type : String } ,
    slug : {type : String } , 
    news : [{type : mongoose.Types.ObjectId , ref : 'News'}]
})

const Tags = mongoose.model('Tags' , tagSchema);
module.exports = Tags ;
