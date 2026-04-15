const mongoose = require("mongoose");
const { Schema } = mongoose;

const ownerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  restaurantType: {
    type: String,
    enum: ["veg", "non-veg"],
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  foodtype: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    // required:true
  },
  avgRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  deliveryEtaMin: {
    type: Number,
    default: 30,
    min: 10,
    max: 120,
  },
  costForTwo: {
    type: Number,
    default: 299,
    min: 0,
  },
  /** Optional map pin for distance-based discovery (near you). */
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  /** Admin moderation: hidden restaurants do not appear in public listings. */
  isActive: {
    type: Boolean,
    default: true,
  },
},
  { timestamps: true }
);

const Owner = mongoose.model("owner", ownerSchema);
module.exports = Owner;
