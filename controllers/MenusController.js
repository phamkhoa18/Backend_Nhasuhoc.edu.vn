const Menus = require('../models/Menus');
const Utils = require('../Utils');


const MenusController = {

    add : async(req ,res) => {
        try {
            const menu = new Menus({
                name : req.body.name , 
                link : req.body.link || 'danh-muc/' +  Utils.slug(req.body.name),
                slug : Utils.slug(req.body.name),
                categoryId : req.body.categoryId ,
                parentId : req.body.parentId
            })
            console.log(menu);
            const menusave = await menu.save();
            res.status(200).json({status : 200 , message : menusave});
        } catch (error) {
            res.status(404).json({status : 404 ,message : error});
        }
    },

    edit : async(req ,res) => {
        const menudatabase = await Menus.findByIdAndUpdate(req.body._id , {
            name : req.body.name , 
            link : req.body.link || 'danh-muc/' +  Utils.slug(req.body.name),
            slug : Utils.slug(req.body.name),
            categoryId : req.body.categoryId ,
            parentId : req.body.parentId 
        })
        if(!menudatabase) {
            res.status(404).json({status : 404 , message : "Sai id rồi"});
        }else{
            res.status(200).json({status : 200 , message : menudatabase});
        }
    },

    list : async (req,res) => {
        try {
            const menu = await Menus.find().sort('posision');
            res.status(200).json(menu);
        } catch (error) {
            res.status(404).json({message : error});
        }
    },

    getparent_children :  async(req,res) =>  {
        const getMenu = await Menus.find({ parentId: null }).lean().sort('posision').populate('categoryId');
        async function getChildren(menu) {
          const children = await Menus.find({ parentId: menu._id }).lean();
          if (children.length > 0) {
            menu.children = children;
            for (let i = 0; i < children.length; i++) {
              await getChildren(children[i]);
            }
          }
        }
      
        for (let i = 0; i < getMenu.length; i++) {
          await getChildren(getMenu[i]);
        }
      
        res.json(getMenu);
      },

    del : async(req ,res) => {
        const del = await Menus.deleteOne({_id : req.params.id});
        if (del.deletedCount === 1) {
            res.status(200).json({ status : 200 , message : 'Successfully deleted one document.'});
        } else {
            res.status(404).json({status : 404 ,message : 'No documents matched the query. Deleted 0 documents.'});
        }
    },

    find_slug : async(req,res) => {
        try {
            const find = await Menus.findOne({slug : req.params.slug}).populate('categoryId');
            if(find) {
                res.status(200).json(find);
            } 
            if(!find) {
                res.json({});
            }
        } catch (error) {
            res.status(404).json(error);
        }
    },
    find_id : async (req,res) => {
        const menudatabase = await Menus.findOne({_id : req.params.id});
        res.status(200).json(menudatabase);
    },

    update : async(req , res) => {
        try {
            // set giá trị posision về 0 
            const updateMenuArray = await Menus.updateMany({} , {$set : {posision : 0}});
            var menuArrayNew = req.body.menuarraynew ;
            // set giá trị mới cho posision
            for (let i = 0; i < menuArrayNew.length; i++) {
                await Menus.updateOne({_id: menuArrayNew[i]._id}, {$set: {posision: i}});
            }
            res.status(200).json({ status : 200 , message: 'Update menu success!' });
        } catch (error) {
            res.status(500).json({  status : 500, message: 'Server error!' });
        }
    }
}

module.exports = MenusController ;