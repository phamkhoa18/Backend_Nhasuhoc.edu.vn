const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    news_id :  {type : mongoose.Types.ObjectId , ref : 'News'} ,
    user_id : {type : mongoose.Types.ObjectId , ref : 'Users'} ,
    content : {type : String }
})

const Comments = mongoose.model('Comments' , commentSchema);
module.exports = Comments ;
