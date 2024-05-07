const Categories = require('../models/Categories');
const News = require('../models/News');
const Utils = require('../Utils');
const NewsController = {
    Add_new : async (req,res) => {
        try {
            const id_generation = Math.floor((Math.random() * 100) + 1); 
            const news = new News({
                id_new : id_generation ,
                title : req.body.title ,
                description : req.body.description , 
                image : req.file.filename ,
                content : req.body.content ,
                author : req.body.author ,
                link : req.body.link || 'bai-viet/' + Utils.slug(req.body.title + '_' + id_generation),
                slug :  Utils.slug(req.body.title + '_' + id_generation),
                category_id : req.body.category_id ,
                published_at : req.body.published_at ,
                tags : req.body.tags || [],
            })
            const newsave = await news.save() ;
            res.status(200).json({status : 200 , message : newsave});
        } catch (error) {
            res.status(404).json({status : 404 , message : error});
        }
    },
    
    List_new : async(req,res) => {
        try {
            const list = await News.find().populate('category_id').sort({ published_at: -1 }); ;
            res.status(200).json(list) ;
        } catch (error) {
            res.status(404).json(error);
        }
    },

    NewFeed : async(req,res) => {
        try {
            const list = await News.find().sort({ published_at: -1 }).populate('type_id').limit(3) ;
            res.status(200).json(list) ;
        } catch (error) {
            res.status(404).json(error);
        }
    },

    Find_new_Category : async(req,res) => {
        try {
            const list = await News.find({category_id : req.body.id_category});
            res.status(200).json(list);
        } catch (error) {
            res.status(404).json(error);
        }
    },

    Find_new_Category_get : async (req,res) => {
        try {
            const list = await News.find({category_id : req.params._id}).populate('type_id').sort({ published_at: -1 });
            res.status(200).json(list);
        } catch (error) {
            res.status(404).json(error);
        }
    },

    Find_new_Category_get_limit: async(req,res) => {
        try {
            const list = await News.find({category_id : req.params._id}).limit(10);
            res.status(200).json(list);
        } catch (error) {
            res.status(404).json(error);
        }
    },

    Find_new_limit: async(req,res) => {
        try {
            const list = await News.find({} , {content : 0}).sort({published_at: -1}).limit(req.params.limit).populate('category_id');;
            res.status(200).json(list);
        } catch (error) {
            res.status(404).json(error);
        }
    },

    One_new : async(req,res) => {
        try {
            const one = await News.findOne({slug : req.params.slug}).populate('type_id');
            res.status(200).json(one);
        } catch (error) {
            res.status(404).json(error);
        }
    },

    edit : async(req,res) => {
        try {
            var image2 = '' ;
            if(typeof req.file === 'undefined') {
                image2 = req.body.image_old ;
            } else {
                image2 = req.file.filename ;
                // remove image old 
                Utils.removeimage_uploads(req.body.image_old);
            }
            const news = await News.findByIdAndUpdate( req.body._id , {
                title : req.body.title,
                description : req.body.description , 
                image : image2,
                link : req.body.link || 'bai-viet/' + Utils.slug(req.body.title + '_' + req.body.id_new),
                slug :  Utils.slug(req.body.title + '_' + req.body.id_new),
                content : req.body.content ,
                author : req.body.author ,
                category_id : req.body.category_id ,
                tags : req.body.tags || [],
            })
            const newsave = await news.save() ;
            res.status(200).json({status : 200 , message : newsave});
        } catch (error) {
            res.status(404).json({status : 404 , message : error});
        }
    } ,

    Update_new_image : async(req,res) => {
        try {
            console.log(req.file.filename);
            const imagecurren = await News.findById(req.body._id);
            Utils.removeimage_uploads(imagecurren.image);
           // remove image in uploads 
            
            const database = await News.findByIdAndUpdate(req.body._id , {
                title : req.body.title ,
                description : req.body.description , 
                image : req.file.filename ,
                type_id : req.body.type_id ,
                link :  'bai-viet/' + Utils.slug(req.body.title),
                slug : Utils.slug(req.body.title),
                category_id : req.body.category_id ,
                outstanding : req.body.outstanding ,
                updated_at : Date.now() ,
                created_at : Date.now() 
            })

            if(database){
                res.status(200).json({status : 200 , message : "update thanh cong"});
            } else {
                res.status(404).json({ status : 404 , message : "Khong ton tai "});
            }
        } catch (error) {
            res.status(404).json(error);
        }
    },

    get_new : async(req,res) => {
        try {
            const one = await News.findOne({_id : req.params.id});
            res.status(200).json(one);
        } catch (error) {
            res.status(404).json(error);
        }
    },

    get_category_new : async(req,res) => {
        try {
            const detail = await Categories.findOne({_id : req.params.id});
            const listnew = await News.find({category_id : req.params.id}, {content : 0}).sort({ published_at: -1 }).populate('category_id').limit(6)
            res.status(200).json({title : detail , data : listnew }) ;
        } catch (error) {
            res.status(404).json(error)
        }
    } ,

    Del_new : async(req , res) => {
        try {
            const imagecurren = await News.findById(req.params.id);

            Utils.removeimage_uploads(imagecurren.image);
            
            const deletedNews = await News.deleteOne({_id : req.params.id});

            
            res.status(200).json({ status: 200, message: deletedNews });
        } catch (error) {
            res.status(404).json({message : "xóa thất bại "});
        }
    },

    Outstanding : async(req,res) => {
        try {
            const outstanding = await News.find({outstanding : true});
            res.status(200).json(outstanding);
        } catch (error) {
            res.status(494).json(error);
        }
    },

    Find_new_slug : async(req,res) => {
        try {
            const news = new News.find({})
        } catch (error) {
            
        }
    },

    Tim_kiem : async(req,res) => {
        try {
            const timkiem = req.body.timkiem;
            const data = await News.find({ $text: { $search: timkiem } });
            if(data.length > 0) {
                // có dữ liệu trả về 
                res.status(200).json({status : 200 , data});
            } else {
                res.status(200).json({status : 404 , data});
            }
        } catch (error) {
            res.status(404).json(error);
        }
    },

    Search_new : async(req,res) => {
        try {
            const data = await News.find({ $text: { $search: req.params.name } }); 
            if(data.length > 0) {
                // có dữ liệu trả về 
                res.status(200).json({status : 200 , data});
            } else {
                res.status(200).json({status : 404 , data});
            }
        } catch (error) {
            res.status(404).json(error);
        }
    },

    So_luong : async(req,res) => {
        try {
            const count = await News.countDocuments();
            res.status(200).json(count);
        } catch (error) {
            res.status(404).json(error);
        }
    },

    total_navigation : async(req,res) => {
        try {
            // Tính tổng số lượng bài viết
            const totalPosts = await News.countDocuments({category_id : req.params.categoryId});
            const totalNavigation =  Utils.total_navigation(totalPosts, 2) ;
            res.status(200).json(totalNavigation) ;
        } catch (error) {
            res.status(404).json(error) ;
        }
    },

    find_news_limit : async(req,res) => {
        try {
            const categoryId = req.params.categoryId;
            const page = req.params.page || 1;
            const pageSize = 2;
            const pageNumber = parseInt(page);
            const size = parseInt(pageSize);
        
            // Tính toán index bắt đầu và index kết thúc của trang hiện tại
            const startIndex = (pageNumber - 1) * size;
            const endIndex = pageNumber * size;
        
            // Tìm các bài viết của category theo trang và kích thước trang
            const result = await News.find({ category_id : categoryId })
              .skip(startIndex)
              .limit(size)
              .exec();
        
            // Tính toán tổng số trang dựa trên số lượng bài viết của category
            const totalNewsCount = await News.countDocuments({ category_id: categoryId });
            const totalPages = Math.ceil(totalNewsCount / size);
        
            // Trả về kết quả và tổng số trang
            res.json({ data: result, totalPages });
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
    } ,

    find_slug_new : async(req,res) => {
        try {
            const onenew = await News.findOne({slug : req.params.slug}).populate('category_id');
            // Kiểm tra xem có bài viết không
            if (!onenew) {
                return res.status(404).json({ status: 404, message: "Không tìm thấy bài viết" });
            }                
  
            res.status(200).json({status : 200 , data : onenew});
        } catch (error) {
            res.status(404).json({status : 404 , message : error});
        }
    } ,

    find_random_new : async(req,res) => {
        try {
            const totalNews = await News.countDocuments();

            // Lặp lại cho đến khi chúng ta có đủ 6 bài báo không trùng lặp
            let randomNews = [];
            while (randomNews.length < 6) {
                // Tạo một bài báo ngẫu nhiên từ cơ sở dữ liệu
                const randomIndex = Math.floor(Math.random() * totalNews);
                const randomArticle = await News.findOne().skip(randomIndex);

                // Kiểm tra xem bài báo đã được chọn đã tồn tại trong danh sách hay chưa
                if (!randomNews.find(article => article._id.equals(randomArticle._id))) {
                    // Nếu không, thêm vào danh sách
                    randomNews.push(randomArticle);
                }
            }
            res.status(200).json({ status: 200, data: randomNews });
        } catch (error) {
            res.status(404).json({status : 404 , message : error});
        }
    }

}

module.exports = NewsController ;