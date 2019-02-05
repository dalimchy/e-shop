var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var {addMenu} = require('./../utils/dashboard');

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
  if(req.session.login){
    var data = {
      title:'Menu',
      msg : null,
      userData : {
        user_name : req.session.user_name,
        user_id:req.session.user_id,
        user_email:req.session.user_email,
        user_img:req.session.user_img
      }
    }
    console.log(data.userData);
    res.render('pages/dashboard/menu', data);
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
        var data = {
          title:'Menu',
          msg : 'Menu add successfully!',
          userData : {
            user_name : req.session.user_name,
            user_id:req.session.user_id,
            user_email:req.session.user_email,
            user_img:req.session.user_img
          }
        }
        console.log(data.userData);
        res.redirect('/dashboard/menu');
      }else{
        var data = {
          title:'Menu',
          msg : null,
          userData : {
            user_name : req.session.user_name,
            user_id:req.session.user_id,
            user_email:req.session.user_email,
            user_img:req.session.user_img
          }
        }
        console.log(data.userData);
        res.render('pages/dashboard/menu', data);
      }
    });
    console.log(bodyData);
  }else{
    res.redirect('/login');
  }

});

module.exports = router;
