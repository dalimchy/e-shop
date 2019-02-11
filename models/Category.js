const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 

//create schema
const categorySchema = new Schema({
    category_id:{
        type:String,
        required:true
    },
    category_type:{
        type:String,
        required:true
    },
    category_name:{
        type:String,
        required:true
    },
    category_desc:{
        type:String,
        default:null
    },
    category_icon:{
        type:String,
        default:null
    },
    category_image:{
        type:String,
        default:null
    },
    parent_category_id:{
        type:String,
        default:null
    },
    parent_menu_id:{
        type:String,
        default:null
    },
    status:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    }

});



module.exports = mongoose.model('category',categorySchema);