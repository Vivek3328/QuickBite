const mongoose = require("mongoose");
const { Schema } = mongoose;
const menuitem = require("../models/MenuItemModel");

const OrderSchema = new Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    ownerId : {
        type : String,
        required:true
    },
    // UserId : {
    //     type : String,
    //     required:true
    // },
    menuitem : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'menuitem'
    },
    quantity: {
        type: Number,
        default : 1,
        required: true,
    },
    totalprice: {
        type: Number,
        required: true,
    },
});
module.exports = mongoose.model("order", OrderSchema);
