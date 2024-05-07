const Tags = require('../models/Tags');
const Utils = require('../Utils');


const TagsController = {

    add : async(req ,res) => {
        try {
            // create tags news
            const tag = new Tags({
                title :'#' + req.body.title , 
                slug : Utils.slug(req.body.title) ,
                news : req.body.news || [] 
            })
            const tagsave = await tag.save() ;
            res.status(200).json({status : 200 , message : tagsave});
            
        } catch (error) {
            res.status(404).json({status : 404 ,message : "lỗi nè"});
        }
    },

    edit : async(req ,res) => {
        
    },

    del : async(req ,res) => {

    },


}


module.exports = TagsController ;