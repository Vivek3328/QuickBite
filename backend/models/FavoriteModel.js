const mongoose = require("mongoose");
const { Schema } = mongoose;

const favoriteSchema = new Schema(
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
  },
  { timestamps: true }
);

favoriteSchema.index({ user: 1, owner: 1 }, { unique: true });

module.exports = mongoose.model("favorite", favoriteSchema);
