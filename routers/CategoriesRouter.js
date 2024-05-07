const CategoriesController = require('../controllers/CategoriesController');
const router = require('express').Router();


// router (đường dẫn)

// ADD category
router.post('/add_category' , CategoriesController.add);
// LIST category
router.get('/list_category' , CategoriesController.list);
// FIND SLUG category
router.get('/find_category_slug/:name' , CategoriesController.findslug);
// GET PARENT & CHILDREN category 
router.get('/getcategory' , CategoriesController.getCategories);
// EDIT category 
router.post('/edit_category' , CategoriesController.edit);
// FIND category _ID 
router.get('/find_category_id/:id' , CategoriesController.getone) ;
// DEL category 
router.get('/del_category/:id' , CategoriesController.del);
// GET category news 
router.get('/get_Category_limit', CategoriesController.getCategorieslimit);


module.exports = router ;