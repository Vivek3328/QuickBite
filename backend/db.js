const mongoose = require("mongoose");

const mongoUrl="mongodb+srv://mittal0623:K0zUvhQJI8BCW3tC@quickbite.vvw9bn2.mongodb.net/?retryWrites=true&w=majority"

async function mongo() {
    await mongoose.connect(mongoUrl).then(()=> console.log("successfully")).catch(err => console.log(err));
  };
  
module.exports= mongo;