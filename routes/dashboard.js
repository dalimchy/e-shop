var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.login){
    var data = {
      title:'Dashboard',
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

module.exports = router;
