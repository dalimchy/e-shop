var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var _ = require('lodash');
var fs = require('file-system');
var multer = require('multer');
const uuidv4 = require('uuid/v4');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log(8,file.fieldname);
      if(file.fieldname == 'slider_img'){
        cb(null, './public/admin_assets/images/slider/')
      }else if(file.fieldname == 'category_image'){
        cb(null, './public/admin_assets/images/category/');
      }else if(file.fieldname == 'productImage'){
        cb(null, './public/admin_assets/images/product_images/');
      }else if(file.fieldname == 'feature_image'){
        cb(null, './public/admin_assets/images/product_feature_img/');

      }
    },
    filename: (req, file, cb) => {
      if(file.fieldname == 'slider_img'){
        console.log(file.originalname);
        var fileType = file.originalname.split('.');
        cb(null, fileType[0].split(' ').join('_')+ '@' + Date.now()+'.'+fileType[fileType.length - 1]);
      }else if(file.fieldname == 'category_image'){
        var fileType = file.originalname.split('.');
        cb(null, fileType[0].split(' ').join('_')+ '@' + Date.now()+'.'+fileType[fileType.length - 1]);
      }else if(file.fieldname == 'productImage'){
        var fileType = file.originalname.split('.');
        var fileName = fileType[0].split(',').join('_');
        cb(null, fileName.split(' ').join('_')+ '@' + Date.now()+'.'+fileType[fileType.length - 1]);
      }else if(file.fieldname == 'feature_image'){
        var fileType = file.originalname.split('.');
        var fileName = fileType[0].split(',').join('_');
        cb(null, fileName.split(' ').join('_')+ '@' + Date.now()+'.'+fileType[fileType.length - 1]);

      }
      
    }
});
var uploadSliderImg = multer({storage: storage}).single('slider_img');
var uploadMainCateImg = multer({storage: storage}).single('category_image');
var productFreatureImage = multer({storage: storage}).single('feature_image');
var productImageUpload = multer({storage: storage}).array('productImage', 50);

var _Obj = (obj,key,value)=>{
  for (var i = 0; i < obj.length; i++) {
      if (obj[i][key] === value) {
          return obj[i];
      }
  }
  return false;
}

var {
    addMenu,
    findAppearance,
    appearance_update,
    appearance_delete,
    addSlider,
    addCategory,
    findCategory,
    category_update,
    category_delete,
    findSubCategory,
    addNewProduct,
    findPaginateProduct,
    updateProduct,
    removeProduct
  } = require('./../utils/dashboard');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.login){
    var data = {
      title:'Dashboard',
      msg : null,
      userData : {
        user_name : req.session.user_name,
        user_id:req.session.user_id,
        user_email:req.session.user_email,
        user_img:req.session.user_img
      }
    }
    console.log(data.userData);
    res.render('pages/dashboard', data);
  }else{
    res.redirect('/login');
  }

});
/* GET menu page. */
router.get('/menu', function(req, res, next) {
  if(req.session.msg == undefined){
      req.session.msg = null;
  }
  if(req.session.login){
    findAppearance({type:'menu'},(response)=>{
      if(response.msg == 'success'){
        var data = {
          title:'Menu',
          msg : null,
          ses_msg : req.session.msg,
          allMenu : response.resdata,
          _ : _,
          userData : {
            user_name : req.session.user_name,
            user_id:req.session.user_id,
            user_email:req.session.user_email,
            user_img:req.session.user_img
          }
        }
        // console.log(51, response.resdata);
        req.session.msg = null;
        res.render('pages/dashboard/menu', data);
      }else{
        console.log(response);
      }
    });
    
    
  }else{
    res.redirect('/login');
  }

});

/* add menu page. */
router.post('/menu', function(req, res, next) {
  console.log(req.body);
  if(req.body.active_status == 'on'){
    var status = 1;
  }else{
    var status = 0;
  }
  if(req.session.login){
    var bodyData = {
      appearance_type : 'menu',
      menu_title : req.body.menu_title,
      assign_menu : req.body.assginMenu,
      menu_icon : req.body.menu_icon,
      status : status
    }
    addMenu(bodyData, (response)=>{
      console.log(response.msg);
      if(response.msg == 'success'){
        req.session.msg = "Menu add successfully!";
        res.redirect('/dashboard/menu');
      }else{
        req.session.msg = "Error !!";
        res.redirect('/dashboard/menu');
      }
    });
  }else{
    res.redirect('/login');
  }

});
router.post('/appearance_update', function(req,res){
  if(req.session.login){
    appearance_update(req.body, (response)=>{
      if(response.msg == 'success'){
        res.send(response);
      }
    });
  }else{
    res.redirect('/login');
  }
});
router.post('/appearance_delete', function(req,res){
  if(req.session.login){
    appearance_delete(req.body, (response)=>{
      if(response.msg == 'success'){
        res.send(response);
      }
    });
  }else{
    res.redirect('/login');
  }
});

/* GET menu page. */
router.get('/slider', function(req, res, next) {
  if(req.session.msg == undefined){
      req.session.msg = null;
  }
  if(req.session.login){
    findAppearance({type:'slider'},(response)=>{
      if(response.msg == 'success'){
        var data = {
            title:'Slider',
            msg : null,
            allSlider : response.resdata,
            ses_msg : req.session.msg,
            _ : _,
            userData : {
              user_name : req.session.user_name,
              user_id:req.session.user_id,
              user_email:req.session.user_email,
              user_img:req.session.user_img
            }
          }
          // console.log(51, response.resdata);
          req.session.msg = null;
          res.render('pages/dashboard/slider', data);
      }
    });
  }else{
    res.redirect('/login');
  }

});

router.post('/slider', function(req, res, next) {
  if(req.session.msg == undefined){
      req.session.msg = null;
  }
  if(req.session.login){
    uploadSliderImg(req,res, function(err){
      if(err){
        console.log(err);
      }else{
        var bodyData = {
          appearance_type : 'slider',
          slider_heading : ((req.body.slider_heading == '') ? null: req.body.slider_heading),
          slider_desc : ((req.body.slider_desc == '') ? null: req.body.slider_desc),
          slider_img : req.file.filename,
          assign_slider : req.body.assign_slider,
          status : ((req.body.active_status == 'on') ? 1 : 0)
        }
        addSlider(bodyData, (response)=>{
          console.log(response.msg);
          if(response.msg == 'success'){
            req.session.msg = "slider add successfully!";
            res.redirect('/dashboard/slider');
          }else{
            req.session.msg = "Error !!";
            res.redirect('/dashboard/slider');
          }
        });

      }

    });
    
    
  }else{
    res.redirect('/login');
  }

});

router.get('/main-category', function(req,res,next){
  if(req.session.msg == undefined){
    req.session.msg = null;
  }
  if(req.session.login){
    findAppearance({type:'menu'},(resMenu)=>{
      findCategory((response)=>{
        if(response.msg == 'success'){
          console.log(response)
          var data = {
            title:'Main-category',
            msg : null,
            category : response.resdata,
            menulist : resMenu.resdata,
            _Obj : _Obj,
            ses_msg : req.session.msg,
            _ : _,
            userData : {
              user_name : req.session.user_name,
              user_id:req.session.user_id,
              user_email:req.session.user_email,
              user_img:req.session.user_img
            }
          }
          req.session.msg = null;
          res.render('pages/dashboard/main_category', data);
        }
      });
    });
  }else{
    res.redirect('/login');
  }
});


router.post('/main-category', function(req,res){
  if(req.session.login){
    uploadMainCateImg(req,res, function(err){
      if(err){
        console.log(err)
      }else{
        var bodyData = {
          category_type : 'main_category',
          category_name : ((req.body.category_name == '') ? null: req.body.category_name),
          category_desc : ((req.body.category_desc == '') ? null: req.body.category_desc),
          category_image : ((req.file == undefined) ? null: req.file.filename),
          category_icon : req.body.category_icon,
          parent_category_id : null,
          parent_menu_id : ((req.body.parent_menu_id == undefined) ? null: req.body.parent_menu_id),
          status : ((req.body.active_status == 'on') ? 1 : 0)
        }
        console.log(bodyData);
         addCategory(bodyData, (response)=>{
          if(response.msg == 'success'){
            req.session.msg = "Category add successfully!";
            res.redirect('/dashboard/main-category');
          }else{
            req.session.msg = "Error !!";
            res.redirect('/dashboard/main-category');
          }
         }); 
      }
    })
  }else{
    res.redirect('/login');
  }
});

router.post('/category_update',(req,res)=>{
  if(req.session.login){
    category_update(req.body, (response)=>{
      if(response.msg == 'success'){
        res.send(response);
      }
    });
  }else{
    res.redirect('/login');
  }
});
router.post('/category_delete',(req,res)=>{
  if(req.session.login){
    category_delete(req.body, (response)=>{
      if(response.msg == 'success'){
        res.send(response);
      }
    });
  }else{
    res.redirect('/login');
  }
});



router.get('/sub-category', function(req,res,next){
  if(req.session.msg == undefined){
    req.session.msg = null;
  }
  if(req.session.login){
    findCategory((response)=>{
      if(response.msg == 'success'){
        console.log(response)
        var data = {
          title:'Sub-category',
          msg : null,
          category : response.resdata,
          ses_msg : req.session.msg,
          _ : _,
          _Obj : _Obj,
          userData : {
            user_name : req.session.user_name,
            user_id:req.session.user_id,
            user_email:req.session.user_email,
            user_img:req.session.user_img
          }
        }
        req.session.msg = null;
        res.render('pages/dashboard/sub_category', data);
      }
    });
  }else{
    res.redirect('/login');
  }
});



router.post('/sub-category', function(req,res){
  if(req.session.login){
    uploadMainCateImg(req,res, function(err){
      if(err){
        console.log(err)
      }else{
        var bodyData = {
          category_type : 'sub_category',
          category_name : ((req.body.category_name == '') ? null: req.body.category_name),
          category_desc : ((req.body.category_desc == '') ? null: req.body.category_desc),
          category_image : ((req.file == undefined) ? null: req.file.filename),
          category_icon : req.body.category_icon,
          parent_category_id : req.body.parent_category_id,
          parent_menu_id : null,
          status : ((req.body.active_status == 'on') ? 1 : 0)
        }
         addCategory(bodyData, (response)=>{
          if(response.msg == 'success'){
            req.session.msg = "Category add successfully!";
            res.redirect('/dashboard/sub-category');
          }else{
            req.session.msg = "Error !!";
            res.redirect('/dashboard/sub-category');
          }
         }); 
      }
    })
  }else{
    res.redirect('/login');
  }
});


router.get('/add-product', (req,res)=>{
  if(req.session.msg == undefined){
    req.session.msg = null;
  }
  if(req.session.login){
    findCategory((response)=>{
    var data = {
          title:'Add-product',
          msg : null,
          ses_msg : req.session.msg,
          category : response.resdata,
          _ : _,
          _Obj : _Obj,
          userData : {
            user_name : req.session.user_name,
            user_id:req.session.user_id,
            user_email:req.session.user_email,
            user_img:req.session.user_img
          }
        }
        req.session.msg = null;
        res.render('pages/dashboard/add_product', data);
    });

  }else{
    res.redirect('/login');
  }
});



router.post('/productImgUp', (req,res)=>{
  if(req.session.login){
    productImageUpload(req,res,(err)=>{
     if(err){
       console.log(429,err);
     }else{
      res.send(req.files[0].filename);
     }
   });
  }else{
    res.redirect('/login');
  }
});

router.post('/unlinkFile', (req,res)=>{
  if(req.session.login){
    var path = '/admin_assets/images/product_images/'+req.body.value+'';
    
    const fs = require('fs');
  
    fs.unlink("public"+path,function(err){
      if(err)
        res.send('err');
  
        res.send('File deleted!');
    });
  }else{
    res.redirect('/login');
  }
});

router.post('/add-product',(req,res)=>{
  if(req.session.login){
    productFreatureImage(req,res, (err)=>{
      if(err){
        console.log(err);
      }else{
        var proImgeArray = req.body.productImage.split(',');

        var product_id = uuidv4();
        var data = {
                  product_id : product_id,
                  product_name : req.body.product_name,
                  product_model : ((req.body.product_model == '') ? null: req.body.product_model),
                  product_qty : ((req.body.product_qty == '') ? 0: req.body.product_qty),
                  product_main_category_id:req.body.main_category_id,
                  product_sub_category_id : ((req.body.sub_category_id == '') ? null: req.body.sub_category_id),
                  product_label: ((req.body.product_label == '') ? null: req.body.product_label),
                  product_short_desc : ((req.body.sort_desc == '') ? null: req.body.sort_desc),
                  product_long_desc : ((req.body.long_desc == '') ? null: req.body.long_desc),
                  product_price : ((req.body.product_orgianl_price == '') ? 0: req.body.product_orgianl_price),
                  product_discount_price : ((req.body.product_discount_price == '') ? null: req.body.product_discount_price),
                  product_feature_img : ((req.file == undefined) ? 'demo.png': req.file.filename),
                  product_image : ((proImgeArray[0] !== '') ? proImgeArray:[]),
                  status : ((req.body.active_status == 'on') ? 1 : 0)
                }

        addNewProduct(data,(docs)=>{
            if(docs.msg == 'success'){
              req.session.msg = "Product add successfully!";
              res.redirect('/dashboard/add-product');
            }else{
              req.session.msg = "Error !!";
              res.redirect('/dashboard/add-product');
            }
        });
      }
    });
  }else{
    res.redirect('/login');
  }
});

router.post('/findSubCate',(req,res)=>{
  if(req.session.login){
    findSubCategory(req.body.data,(response)=>{
      var cdData = [];
      _.each(response, (v,k)=>{
          var data = {
            name:v.category_name,
            cateId:v.category_id
          }
          cdData.push(data);
      });
      res.send({msg:"success",data:cdData});
    });
  }else{
    res.redirect('/login');
  }
});

router.get('/manage-product', (req,res)=>{
  console.log(req.params)
  if(req.session.msg == undefined){
    req.session.msg = null;
  }
  if(req.session.login){
    var reqData = {
      pageNumber: 1,
      dataLimit : 10,
    }
    findPaginateProduct(reqData,(response)=>{
      if(response.msg == 'success'){
        var data = {
          title:'Manage-product',
          msg : null,
          ses_msg : req.session.msg,
          _ : _,
          product : response.data,
          _Obj : _Obj,
          userData : {
            user_name : req.session.user_name,
            user_id:req.session.user_id,
            user_email:req.session.user_email,
            user_img:req.session.user_img
          }
        }
        req.session.msg = null;
        res.render('pages/dashboard/manage_product', data);
      }
    });
  }else{
    res.redirect('/login');
  } 
});

router.get('/manage-product/:page', (req,res)=>{
  if(req.session.msg == undefined){
    req.session.msg = null;
  }
  if(req.session.login){
    var reqData = {
      pageNumber: req.params.page,
      dataLimit : 10,
    }
    findPaginateProduct(reqData,(response)=>{
      if(response.msg == 'success'){
        var data = {
          title:'Manage-product',
          msg : null,
          ses_msg : req.session.msg,
          _ : _,
          product : response.data,
          _Obj : _Obj,
          userData : {
            user_name : req.session.user_name,
            user_id:req.session.user_id,
            user_email:req.session.user_email,
            user_img:req.session.user_img
          }
        }
        req.session.msg = null;
        res.render('pages/dashboard/manage_product', data);
      }
    });
  }else{
    res.redirect('/login');
  } 
});
router.post('/changeProductStatus', (req,res)=>{
  if(req.session.login){
    var reqData = {
      type : 'status',
      id : req.body.id,
      status : req.body.status
    }
    updateProduct(reqData, (response)=>{
      if(response.msg == 'success'){
        res.send({msg:'success'});
      }
    });
  }else{
    res.redirect('/login');
  }
});

router.post('/removeProduct', (req,res)=>{
  if(req.session.login){
    removeProduct(req.body, (response)=>{
      if(response.msg == 'success'){
        res.send(response);
      }
    });
  }else{
    res.redirect('/login');
  }
});
module.exports = router;
