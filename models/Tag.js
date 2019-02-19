const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 

//create schema
const tagSchema = new Schema({
    tag_id:{
        type:String,
        required:true
    },
    tag_name:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    }

});



module.exports = mongoose.model('tag',tagSchema);