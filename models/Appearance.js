const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create schema
const appearanceSchema = new Schema({
    appearance_id:{
        type:String,
        required:true
    },
    appearance_type:{
        type:String,
        required:true
    },
    menu_title:{
        type:String,
        default:null
    },
    assign_menu:{
        type:String,
        default:null
    },
    menu_icon:{
        type:String,
        default:null
    },
    slider_heading:{
        type:String,
        default:null
    },
    slider_desc:{
        type:String,
        default:null
    },
    slider_img:{
        type:String,
        default:null
    },
    assign_slider:{
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



module.exports = mongoose.model('appearance',appearanceSchema);