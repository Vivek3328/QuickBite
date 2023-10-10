const mongoose = require("mongoose");

const SignupRestaurantSchema = new Schema({
    
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
      },
    pass: {
        type: Array,
        required: true,
    }  
});

module.export= mongoose.model("SignupRestaurant",SignupRestaurantSchema);