var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var _ = require('lodash');

var {
    addMenu,
    findAppearance,
    menuUpdate,
    menuDelete
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
router.post('/menu/menu_update', function(req,res){
  if(req.session.login){
    menuUpdate(req.body, (response)=>{
      if(response.msg == 'success'){
        res.send(response);
      }
    });
  }else{
    res.redirect('/login');
  }
});
router.post('/menu/menu_delete', function(req,res){
  if(req.session.login){
    menuDelete(req.body, (response)=>{
      if(response.msg == 'success'){
        res.send(response);
      }
    });
  }else{
    res.redirect('/login');
  }
});

module.exports = router;
