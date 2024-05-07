const UsersController = require('../controllers/UsersController');
const router = require('express').Router();


// router (đường dẫn)
router.post('/register' , UsersController.add);

router.post('/login' , UsersController.login) ;


module.exports = router ;