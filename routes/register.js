var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var {insertUsers} = require('./../utils/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.login){
    res.redirect('/dashboard');
  }else{
    var data = {
      title : 'Register',
      msg : null
    }
    res.render('pages/dashboard/register', data);
  }
});

router.post('/newUser', function(req, res) {
  if(req.session.login){
    res.redirect('/dashboard');
  }else{
    var data = {
      user_name : req.body.name,
      user_email : req.body.email,
      user_phone : req.body.phone,
      user_password : req.body.password,
      user_img : 'avatar-1.jpg'
    }
    insertUsers(data, (response)=>{
      if(response.msg == 'success'){
        req.session.success = true;
        req.session.login = true;
        req.session.user_id = response.data.user_id;
        req.session.user_name = response.data.user_name;
        req.session.user_email = response.data.user_email;
        req.session.user_img = response.data.user_img;
        res.redirect('/dashboard');
      }else{
        var data = {
          title : 'Register',
          msg : response.msg
        }
        res.render('pages/dashboard/register', data);
      }
    });
  }
});

module.exports = router;
