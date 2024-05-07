const md5 = require('md5') ;
const path = require('path') ;
const fs = require('fs') ;
const Utils = {


    slug :(title) => {
        var slug ;
        //Đổi chữ hoa thành chữ thường
        slug = title.toLowerCase();
  
        //Đổi ký tự có dấu thành không dấu
        slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
        slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
        slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
        slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
        slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
        slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
        slug = slug.replace(/đ/gi, 'd');
        //Xóa các ký tự đặt biệt
        slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|'|\"|\:|\;|_/gi, '');
        //Đổi khoảng trắng thành ký tự gạch ngang
        slug = slug.replace(/ /gi, "-");
        //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
        //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
        slug = slug.replace(/\-\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-/gi, '-');
        slug = slug.replace(/\-\-/gi, '-');
        //Xóa các ký tự gạch ngang ở đầu và cuối
        slug = '@' + slug + '@';
        slug = slug.replace(/\@\-|\-\@|\@/gi, '');
        return slug ;
    },
    
    validSingture(signature , nonce , stime ) {
        if(Date.now() - Number(stime) > 30000) {
            console.log('Quá 30s rồi');
            return false ;
        };
  
        if(Utils.calculateSignature(nonce , stime).toString() != signature) {
          console.log('Không đúng nhé ');
          return false ;
        }
        return true ;
    },
  
    validateRequest(req, res , next) {
        const {'x-nonce' : nonce , 'x-stime' : stime , 'x-signature' : signature} = req.headers ;
        console.log('sign: ' + signature );
        if(!nonce || !stime || !signature) {
            return res.status(400).json({
                message : "No request API none nonce || stime || signture"
            })
        }
        
        if(Utils.validSingture(signature , nonce , stime)) {
               next();
        } else {
            return res.status(400).json({
              message : "No request API "
          })
        }
    },
    
    calculateSignature(nonce, stime) {
  
      const message = `${nonce}${stime}${process.env.SECRETKEY}`;
  
      const calculatedSignature = md5(message); // Sử dụng hàm md5
  
      return calculatedSignature;
    },

    total_navigation(totalnews , limit) {
      return (Math.ceil(totalnews / limit)) ;
  } ,

    removeimage_uploads: (image_curren) => {
        const uploadDir = path.join(__dirname, 'uploads');
        
        const filePath = path.join(uploadDir, image_curren);
        fs.unlink(filePath, (error) => {
          if (error) {
            console.error(`Không thể xóa tệp tin ${image_curren}:`);
          } else {
            console.log(`Đã xóa tệp tin ${image_curren} thành công.`);
          }
        });
     },


}

module.exports = Utils ;