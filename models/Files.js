const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    title : {type : String } , 
    contentType: { type: String },
    data: {type : Buffer},
    caption: {type : String}
})

const Files = mongoose.model('Files' , FileSchema);
module.exports = Files ;
