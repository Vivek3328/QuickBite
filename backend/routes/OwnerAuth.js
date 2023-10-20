const express = require("express");
const router = express.Router();
const bodyParsar = require("body-parser")
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const fetchowner = require("../Middlewares/fetchowner");
const JWT_SECRET = "Iamfine";
const controller = require("../controllers/appController");
const Owner = require("../models/OwnerModel");

router.use(bodyParsar.json());
router.use(bodyParsar.urlencoded({extended:true}));

const path=require('path')
const multer = require("multer");
router.use(express.static('uploads'))
  
// Route-1: To register a new owner
router.post("/registerowner",
[
    body("email", "Enter a valid Email").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("password", "Enter a valid password").isLength({ min: 4 }),
],
async (req, res) => {
    let success = false;
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        // Check whether user with this email exist already
        let owner = await Owner.findOne({ email: req.body.email });
        if (owner) {
            return res
                .status(400)
                .json({ error: "Owner with this Email already exist" });
        }
        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(req.body.password, salt);
        owner = await Owner.create({
            name: req.body.name,
            password: secpass,
            email: req.body.email,
            address:req.body.address,
            restaurantType: req.body.restaurantType,
            pincode:req.body.pincode,
            mobile:req.body.mobile,
            foodtype:req.body.foodtype,
            image: req.body.image
        });
        //we return token instead of id
        const data = {
            owner: {
                id: owner.id,
            },
        };
        const authtoken = jwt.sign(data, JWT_SECRET);
        console.log(authtoken);
        success=true;
        res.json({ success:true, authtoken });
        // res.json(user)
    } catch (error) {
        console.error(error.message);
        // res.status(500).send("Some error occured");
        res.status(500).json({ success:false, error: "Some Error occured" });
    }
}
);

//Route-2: Login of Owner using POST:"/api/ownerauth/loginowner"
router.post("/loginowner",async (req, res) => {
        let success = false;
        const {email,password} = req.body;
        let owner= await Owner.findOne({email:email});
        try{
            console.log(owner,email)
            if(!owner){
                return res
                    .status(400)
                    .json({success, error: "email not found" });
            }
            const passwordCompare = await bcrypt.compare(password,owner.password);
            if(!passwordCompare){
                return res
                    .status(400)
                    .json({success, error: "Invalid Password!" });
            }
            const data = {
                owner: {
                    id: owner.id,
                },
            };
            const authtoken = jwt.sign(data, JWT_SECRET);
            // console.log(authtoken);
            success = true;
            res.json({success, authtoken });
        }catch (error){
            console.error(error.message);
            res.status(500).send("login failed");
        }
    }
);


// Route-3 : GET all owners using 'api/ownerauth/fetchallowner'
router.get("/fetchallowner", async (req, res) => {
  try {
      const items = await Owner.find({});
      res.json(items);
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
  }
});
module.exports = router;