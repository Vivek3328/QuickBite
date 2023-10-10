const mongoose = require("mongoose");

const LoginRestaurantSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
      },
    pass: {
        type: Array,
        required: true,
        // unique
    }  
});

module.export= mongoose.model("LoginRestaurant",LoginRestaurantSchema);
