var express = require('express');
var router = express.Router();
var _ = require('lodash');


var {forntend} = require('./../utils/frontend');

var _Obj = (obj,key,value)=>{
  for (var i = 0; i < obj.length; i++) {
      if (obj[i][key] === value) {
          return obj[i];
      }
  }
  return false;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.msg == undefined){
    req.session.msg = null;
  }
  forntend((response)=>{
    if(response.msg == 'success'){
      var data = {
        title:'Home',
        msg : null,
        appearance : response.appearance,
        category : response.category,
        tag : response.tag,
        products : response.products,
        _Obj : _Obj,
        ses_msg : req.session.msg,
        _ : _
      }
      req.session.msg = null;
      res.render('pages/frontend/index', data);
    }
  });
});

module.exports = router;
