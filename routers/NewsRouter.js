const NewsController = require('../controllers/NewsController');
const router = require('express').Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname);
    cb(null, uniqueSuffix + extname);
  }
});

const upload = multer({ storage: storage });
// router (đường dẫn)
router.post('/addnew' , upload.single('image') , NewsController.Add_new);

router.post('/edit_new' , upload.single('image') , NewsController.edit);

router.post('/updatenew_image' , upload.single('image') , NewsController.Update_new_image);

router.get('/listnew' , NewsController.List_new);

router.get('/listnew_id/:id' , NewsController.get_new);

router.get('/newfeed' , NewsController.NewFeed);

router.post('/findnewcategory' , NewsController.Find_new_Category);

router.get('/findnewcategory/:_id' , NewsController.Find_new_Category_get);

router.get('/findnewcategorylimit/:_id' , NewsController.Find_new_Category_get_limit);

router.get('/list_new_limit/:limit' , NewsController.Find_new_limit);

router.get('/find_slug_new/:slug' , NewsController.find_slug_new);

router.get('/listnew/:slug' , NewsController.One_new);

router.get('/del_new/:id' , NewsController.Del_new);

router.get('/outstanding' , NewsController.Outstanding);

router.get('/findnew/:slug' , NewsController.Find_new_slug);

router.post('/tim-kiem' , NewsController.Tim_kiem );

router.get('/soluongbaiviet' , NewsController.So_luong);

router.get('/total_navigation/:categoryId', NewsController.total_navigation);

router.get('/find_news_limit/:categoryId/:page', NewsController.find_news_limit);

router.get('/find_random_new', NewsController.find_random_new);

router.get('/search/:name' , NewsController.Search_new);

router.get('/get_category_new/:id' , NewsController.get_category_new);

module.exports = router ;