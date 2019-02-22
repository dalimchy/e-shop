var express = require('express');
var router = express.Router();



const Appearance = require('../models/Appearance');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Tag = require('../models/Tag');

var forntend = (callback)=>{
    Appearance.find().sort({created_at: 'desc'}).exec(function (err, docs) {
        if(err){
            console.log(err);
        }else{
            Category.find().sort({created_at: 'desc'}).exec(function (err, docs2) {
                if(err){
                    console.log(err);
                }else{
                    Tag.find().sort({created_at: 'desc'}).exec(function (err, docs3) {
                        if(err){
                            console.log(err);
                        }else{
                            callback({msg:'success',appearance:docs,category:docs2,tag:docs3});
                        }
                    });
                }
            });
        }
    });
}

module.exports = {forntend};