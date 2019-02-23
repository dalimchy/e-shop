const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;


//create schema
const productSchema = new Schema({
    product_id:{
        type:String,
        required:true
    },
    product_name:{
        type:String,
        required:true
    },
    product_qty:{
        type:Number,
        default:0
    },
    product_model:{
        type:String,
        default:null
    },
    product_price:{
        type:Number,
        required:true
    },
    product_discount_price:{
        type:Number,
        default:null
    },
    product_feature_img:{
        type:String,
        required:true
    },
    product_feature_img_enc:{
        type:String,
        default:null
    },
    product_image:{
        type:Array,
        default:[]
    },
    product_main_category_id:{
        type:String,
        required:true
    },
    product_sub_category_id:{
        type:String,
        default:null
    },
    product_label:{
        type:String,
        default:null
    },
    product_short_desc:{
        type:String,
        default:null
    },
    product_long_desc:{
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

productSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('product',productSchema);