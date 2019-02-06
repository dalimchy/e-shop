var express = require('express');
var router = express.Router();
const uuidv4 = require('uuid/v4');

const Appearance = require('../models/Appearance');

var addMenu =(data,callback)=>{
    var appearance_id = uuidv4();
    var menuData = {
        appearance_id: appearance_id,
        appearance_type: data.appearance_type,
        menu_title : data.menu_title,
        assign_menu : data.assign_menu,
        menu_icon : data.menu_icon,
        status : data.status
    }
    var newMenu = new Appearance(menuData);
    newMenu.save().then(res =>{
        callback({msg:'success',data:menuData});
    })
    .catch(err => console.log(err));
}
var findAppearance =(data,callback)=>{
    Appearance.find({appearance_type:data.type}).sort({created_at: 'desc'}).exec(function (err, docs) {
        if(err){
            console.log(err);
        }else{
            callback({msg:'success',resdata:docs});
        }
    });

}

var menuUpdate = (data,callback)=>{
    if(data.type == 'status'){
        Appearance.update({appearance_id : data.id}, {status :data.value}, (err,result)=>{
            if(err){
                console.log(err);
            }else{
                callback({msg:'success',data:result});
            }
        })
    }
}
var menuDelete = (data,callback)=>{
    Appearance.deleteOne({appearance_id : data.id}, (err,result)=>{
        if(err){
            console.log(err);
        }else{
            callback({msg:'success',data:result});
        }
    })
}
module.exports = {addMenu,findAppearance,menuUpdate,menuDelete};
