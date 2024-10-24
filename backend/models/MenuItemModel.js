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
});

module.exports = mongoose.model("menuitem", MenuItemSchema);
