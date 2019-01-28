var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.login){
    var data = {
      title:'Dashboard',
      userData : {user_name : req.session.user_name}
    }
    console.log(data.userData);
    res.render('dashboard', data);
  }else{
    res.redirect('/login');
  }
  
});

module.exports = router;
