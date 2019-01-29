var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var {loginCheck} = require('./../utils/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.login){
    res.redirect('/dashboard');
  }else{
    var resdata = {
      title : 'Login',
      msg : null
    }
    res.render('pages/dashboard/login', resdata);
  }
});
router.post('/loginCheck', function(req, res) {
  if(req.session.login){
    res.redirect('/dashboard');
  }else{
    var data = {
      user_email : req.body.email,
      user_password : req.body.password
    }
    loginCheck(data,(response)=>{
      if(response.msg == 'success'){
        req.session.success = true;
        req.session.login = true;
        req.session.user_id = response.data.user_id;
        req.session.user_name = response.data.user_name;
        req.session.user_email = response.data.user_email;
        req.session.user_img = response.data.user_img;
        res.redirect('/dashboard');
      }else{
        var resdata = {
          title : 'Login',
          msg : response.msg
        }
        res.render('pages/dashboard/login', resdata);
      }
    });
  }
});

module.exports = router;
