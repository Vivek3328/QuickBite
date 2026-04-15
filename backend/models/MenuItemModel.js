const mongoose = require("mongoose");
const { Schema } = mongoose;

const MenuItemSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "owner",
  },
  itemname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  isVeg: {
    type: Boolean,
    default: true,
  },
  isOutOfStock: {
    type: Boolean,
    default: false,
  },
  prepTimeMin: {
    type: Number,
    min: 5,
    max: 180,
  },
});

module.exports = mongoose.model("menuitem", MenuItemSchema);
