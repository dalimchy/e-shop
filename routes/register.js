var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/admin_assets/images/users/')
    },
    filename: (req, file, cb) => {
      if(file.fieldname == 'profile_pic'){
        var user_name = req.body.name;
        var fileType = file.originalname.split('.');
        cb(null, user_name.split(' ').join('_')+ '@' + Date.now()+'.'+fileType[1]);
      }
      
    }
});
var upload = multer({storage: storage}).single('profile_pic');


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
  upload(req,res, function(err){
    if(err){
      console.log(err);
    }else{
      if(req.session.login){
        res.redirect('/dashboard');
      }else{
        var data = {
          user_name : req.body.name,
          user_email : req.body.email,
          user_phone : req.body.phone,
          user_password : req.body.password,
          user_img : res.req.file.filename
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
    }
  });
});

module.exports = router;
