const MenusController = require('../controllers/MenusController');
const router = require('express').Router();


// router (đường dẫn)
router.post('/add_menu' , MenusController.add);

router.post('/edit_menu' , MenusController.edit) ;

router.get('/list_menu' , MenusController.list);

// GET PARENT & CHILDREN MENU 
router.get('/get_Menu' , MenusController.getparent_children);

router.get('/find_menu_id/:id' , MenusController.find_id) ;

router.get('/del_menu/:id' , MenusController.del);

router.get('/find_slug/:slug' ,MenusController.find_slug );

router.post('/update_index_menu' , MenusController.update);

module.exports = router ;