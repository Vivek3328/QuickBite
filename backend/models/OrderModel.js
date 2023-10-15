const mongoose = require("mongoose");
const { Schema } = mongoose;
const menuitem = require("../models/MenuItemModel");

const ItemSchema= new Schema({
    menuitem :{ 
        type : mongoose.Schema.Types.ObjectId,
        ref : 'menuitem' 
    },
    quantity : {
        type: Number,
        default : 1
    }
})


const OrderSchema = new Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    menuitem:[ItemSchema],
    totalprice: {
        type: Number,
        required: true,
    },
});
module.exports = mongoose.model("order", OrderSchema);
