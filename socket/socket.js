module.exports = function (io) {
    var app = require('express');
    var router = app.Router();
    io.on('connection', function (socket) {
      
    });
  
    return router;
  }