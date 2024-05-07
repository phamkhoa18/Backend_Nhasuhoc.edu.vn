const Users = require('../models/Users');
const bcrypt = require('bcryptjs');

// role phan quyen 
// 1 : admin , 2 : manager, 3 : user

const UsersController = {

    add : async(req ,res) => {
        try {
            const user = new Users({
                name : req.body.name , 
                email : req.body.email ,
                password : req.body.password ,
                role : req.body.role || 1 
            })
            const userdata = await Users.findOne({email : user.email});
            if(userdata) {
                res.status(404).json({message : "This account already exists"});
            } else {
                bcrypt.hash(user.password , 10 ,async (err, v) => {
                    user.password = v ;
                    const usersave = await user.save();
                    res.status(200).json(usersave);
                });
            }
        } catch (error) {
            res.status(404).json({message : error});
        }
    },

    login : async(req,res) => {
        try {
            const user = new Users({
                password : req.body.password ,
                email    : req.body.email ,
            })
            const userdata = await Users.findOne({email : user.email});
            if(userdata) {
                bcrypt.compare(user.password , userdata.password)
                    .then((result) => {
                        if(result) {
                            res.status(200).json({status : 200 , message : userdata});
                        }else {
                            res.status(200).json({status : 404 ,message : "email or password is incorrect"});
                        }
                    })
            } else {
                res.status(200).json({status : 404 ,message : "email or password is incorrect"});
            }
        } catch (error) {
            res.status(200).json({status : 404 ,message : "email or password is incorrect"});
        }
    },

    edit : async(req ,res) => {

    },

    del : async(req ,res) => {

    },


}


module.exports = UsersController ;