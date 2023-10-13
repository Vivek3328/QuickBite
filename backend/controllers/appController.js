const Owner = require("../models/OwnerModel");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const registerowner =async(req,res)=>{
    try {
        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(req.body.password, salt);
        const owner= await Owner({
            name: req.body.name,
            email: req.body.email,
            password: secpass,
            address: req.body.address,
            restaurantType:req.body.restaurantType,
            pincode: req.body.pincode,
            mobile: req.body.mobile,
            image: req.file.filename,
        });
            const data= await owner.save();
            res.status(200).send({success:true,data:data});
    }catch (error) {
        res.status(400).send(error.message);
    }
}


const loginowner = async(req,res)=>{

}
module.exports={
    registerowner
}