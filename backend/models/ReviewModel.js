const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "owner",
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "order",
      required: true,
      unique: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model("review", reviewSchema);
