const mongoose= require('mongoose')
const { Schema } = mongoose

const ownerSchema = new Schema({
      name:{
            type:String,
            required:true
      },
      email:{
            type:String,
            required:true,
            unique:true 
      },
      password:{
            type:String,
            required:true
      }
})

const Owner = mongoose.model('owner',ownerSchema);
module.exports = Owner; 