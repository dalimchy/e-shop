var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var _ = require('lodash');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if(file.fieldname == 'slider_img'){
        cb(null, './public/admin_assets/images/slider/')
      }else if(file.fieldname == 'category_image'){
        cb(null, './public/admin_assets/images/category/');
      }
    },
    filename: (req, file, cb) => {
      if(file.fieldname == 'slider_img'){
        var fileType = file.originalname.split('.');
        cb(null, fileType[0]+ '@' + Date.now()+'.'+fileType[fileType.length - 1]);
      }else if(file.fieldname == 'category_image'){
        var fileType = file.originalname.split('.');
        cb(null, fileType[0]+ '@' + Date.now()+'.'+fileType[fileType.length - 1]);
      }
      
    }
});
var uploadSliderImg = multer({storage: storage}).single('slider_img');
var uploadMainCateImg = multer({storage: storage}).single('category_image');

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
    category_delete
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

module.exports = router;
