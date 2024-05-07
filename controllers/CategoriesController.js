const Categories = require('../models/Categories');
const Menus = require('../models/Menus');
const News = require('../models/News');
const Util = require('../Utils');

const CategoriesController = {

    add : async(req ,res) => {
        try {
            const category = new Categories({
                title : req.body.title , 
                slug : Util.slug(req.body.title),
                link : req.body.link ?? ('danh-muc/' + Util.slug(req.body.title)) ,
                parent_id : req.body.parent_id ?? null 
            })
            const savedCategory = await category.save();
            // Nếu danh mục cha tồn tại, cập nhật danh mục cha để thêm danh mục con mới
            if (savedCategory.parent_id) {
                const parentCategory = await Categories.findById(savedCategory.parent_id);
                if (parentCategory) {
                    parentCategory.children.push(savedCategory._id);
                    await parentCategory.save();
                } else {
                    console.log("Không tìm thấy danh mục cha.");
                }
            }
            res.status(200).json({status : 200 , message : savedCategory});
        } catch (error) {
            res.status(404).json({status : 404 ,message : "lỗi nè"});
        }
    },

    edit: async (req, res) => {
        try {
            const categoryId = req.body._id; // ID của danh mục cần chỉnh sửa
            console.log(categoryId);
            const updatedFields = {
                title: req.body.title,
                slug: Util.slug(req.body.title),
                link: req.body.link ?? ('danh-muc/' + Util.slug(req.body.title)),
                parent_id: req.body.parent_id ?? null
            };
            // Tìm danh mục trước khi chỉnh sửa để lấy thông tin về parent_id cũ
            const categoryBeforeUpdate = await Categories.findById(categoryId);
            // Tìm và cập nhật danh mục
            const updatedCategory = await Categories.findByIdAndUpdate(categoryId, updatedFields, { new: true });
        
            // Nếu parent_id được thay đổi hoặc trở thành null, cần cập nhật danh sách con của danh mục cha cũ và mới
            if (categoryBeforeUpdate.parent_id !== updatedCategory.parent_id) {
                // Nếu parent_id cũ tồn tại, cập nhật danh sách con của danh mục cha cũ
                if (categoryBeforeUpdate.parent_id) {
                    const oldParentCategory = await Categories.findById(categoryBeforeUpdate.parent_id);
                    if (oldParentCategory) {
                        const indexToRemove = oldParentCategory.children.indexOf(categoryId);
                        if (indexToRemove !== -1) {
                            oldParentCategory.children.splice(indexToRemove, 1);
                        }
                        await oldParentCategory.save();
                    }
                }
                // Nếu parent_id mới tồn tại, cập nhật danh sách con của danh mục cha mới
                if (updatedCategory.parent_id) {
                    const newParentCategory = await Categories.findById(updatedCategory.parent_id);
                    if (newParentCategory) {
                        newParentCategory.children.push(updatedCategory._id);
                        await newParentCategory.save();
                    }
                }
            } else if (updatedCategory.parent_id === null && categoryBeforeUpdate.parent_id) {
                // Nếu parent_id trở thành null, xóa danh mục khỏi danh sách con của danh mục cha cũ
                const oldParentCategory = await Categories.findById(categoryBeforeUpdate.parent_id);
                if (oldParentCategory) {
                    oldParentCategory.children = await oldParentCategory.children.filter(childId => childId !== categoryId);
                    console.log(oldParentCategory.children);
                    await oldParentCategory.save();
                }
            }
            res.status(200).json({ status: 200, message: updatedCategory });
        } catch (error) {
            res.status(404).json({ status: 404, message: "lỗi nè" });
        }
    },

    getone : async (req,res) => {
        try {
            const category = await Categories.findOne({_id : req.params.id});
            res.status(200).json(category);

        } catch (error) {
            res.status(404).json({ status: 404, message: "lỗi nè" });
        }
    },

    
    
    getCategories :  async(req,res) =>  {
        const categories = await Categories.find({ parent_id: null }).lean();
        async function getChildren(category) {
          const children = await Categories.find({ parent_id: category._id }).lean();
          if (children.length > 0) {
            category.children = children;
            for (let i = 0; i < children.length; i++) {
              await getChildren(children[i]);
            }
          }
        }
        for (let i = 0; i < categories.length; i++) {
          await getChildren(categories[i]);
        }
        res.json(categories);
      },

    list : async (req,res) => {
        try {
            const category = await Categories.find();
            res.status(200).json(category);
        } catch (error) {
            res.status(404).json({message : error});
        }
    },

    findslug : async(req,res) => {
        try {
            // Tìm danh mục dựa trên slug menus
        const menus = await Menus.findOne({slug : req.params.name})
        console.log(menus);

        if (!menus) {
            // Nếu không tìm thấy danh mục, trả về mã lỗi 404
            return res.status(404).json({ message: "Danh mục không tồn tại" });
        }

        const category = await Categories.findOne({_id : menus.categoryId});
        console.log(category);

        if (!category) {
            // Nếu không tìm thấy danh mục, trả về mã lỗi 404
            return res.status(404).json({ message: "Danh mục không tồn tại" });
        }

        // Tìm bài viết thuộc danh mục đã tìm thấy
        const posts = await News.find({ category_id: menus.categoryId }, {content : 0}).limit(5).populate('category_id');

        // Tìm một category ngẫu nhiên không trùng với category hiện có
        const randomCategory = await Categories.aggregate([
            { $match: { _id: { $nin: [menus.categoryId] } } }, // Lọc ra các category không trùng với category hiện có
            { $sample: { size: 1 } } // Lấy một category ngẫu nhiên từ kết quả lọc
        ]);

        console.log(randomCategory);

            // Trả về danh sách bài viết của danh mục
            res.status(200).json({ category : category , listnew : posts , categoryads: randomCategory[0]._id});
        } catch (error) {
            res.status(404).json({message : error});
        }
    },

    getCategorieslimit : async(req,res) => {
        try {
            const category = await Categories.find().sort({ createdAt: -1 }).limit(4);
            res.status(200).json(category);
        } catch (error) {
            res.status(404).json({message : error});
        }
    } ,


    del : async(req ,res) => {
        try {
        const del = await Categories.deleteOne({_id : req.params.id});
            if (del.deletedCount === 1) {
                res.status(200).json({status : 200 ,message : 'Successfully deleted one document.'});
                } else {
                res.status(404).json({status : 404 , message : 'No documents matched the query. Deleted 0 documents.'});
            }
        } catch (error) {
            res.status(404).json({message : error});
        }
    },


}

module.exports = CategoriesController ;