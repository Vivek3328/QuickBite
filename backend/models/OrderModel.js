const mongoose = require("mongoose");
const { Schema } = mongoose;

// Subschema for shipping details
const ShippingSchema = new Schema({
  mobile: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  paymode: {
    type: String,
    enum: ["Credit Card", "Debit Card", "Net Banking", "Cash on Delivery"],
    required: true,
  },
});

// Subschema for items in the order
const ItemSchema = new Schema({
  menuitem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "menuitem",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    required: true,
  },
});

// Main order schema
const OrderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "owner",
    required: true,
  },
  item: [ItemSchema],
  totalprice: {
    type: Number,
    required: true,
  },
  shipping: {
    type: ShippingSchema, // Use the ShippingSchema as a subdocument
    required: true,
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Being Baked",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ],
    default: "Pending",
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("order", OrderSchema);
