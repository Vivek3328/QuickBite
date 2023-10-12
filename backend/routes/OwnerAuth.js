const express = require("express");
const router = express.Router();
const Owner = require("../models/OwnerModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchowner = require("../Middleware/fetchowner");
const JWT_SECRET = "Iamfine";

//ROUTE-1 : Register user using POST:"/api/ownerauth/registerowner"
router.post("/registerowner",
    [
        body("email", "Enter a valid Email").isEmail(),
        body("name", "Enter a valid name").isLength({ min: 5 }),
        body("password", "Enter a valid password").isLength({ min: 6 }),
        body("restaurantType","Enter Either Veg or Nonveg").isIn(['veg', 'non-veg'])
    ],
    async (req, res) => {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            // Check whether user with this email exist already
            let owner = await Owner.findOne({ email: req.body.email });
            if (owner) {
                return res
                    .status(400)
                    .json({ error: "User with this Email already exist" });
            }
            const salt = await bcrypt.genSalt(10);
            const secpass = await bcrypt.hash(req.body.password, salt);
            owner = await Owner.create({
                name: req.body.name,
                password: secpass,
                email: req.body.email,
                address: req.body.password,
                restaurantType : req.body.restaurantType
            });
            //we return token instead of id
            const data = {
                owner: {
                    id: owner.id,
                },
            };
            const authtoken = jwt.sign(data, JWT_SECRET);
            console.log(authtoken);
            // res.json({ authtoken });
            res.json(owner)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error occured");
        }
    }
)

//Route-2: Login of Owner using POST:"/api/ownerauth/loginowner"
router.post("/loginowner",
    [
        body("email", "Enter a valid Email").isEmail(),
        body("password", "Password cannot be empty").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {email,password} = req.body;
        try{
            let owner = await Owner.findOne({email});
            if(!owner){
                return res
                    .status(400)
                    .json({ error: "Invalid Credential!" });
            }
            const passwordCompare = await bcrypt.compare(password,owner.password);
            if(!passwordCompare){
                return res
                    .status(400)
                    .json({ error: "Invalid Password!" });
            }
            const data = {
                owner: {
                    id: owner.id,
                },
            };
            const authtoken = jwt.sign(data, JWT_SECRET);
            // console.log(authtoken);
            res.json({ authtoken });
        }catch (error){
            console.error(error.message);
            res.status(500).send("Internal server error occured");
        }
    })

//Route-3: Get loggedin Owner Detail using POST:"/api/ownerauth/getowner"  
router.post("/getowner", fetchowner ,async (req, res) => {
        try {
            const ownerId = req.owner.id;
            const owner= await Owner.findById(ownerId).select("-password")
            res.send(owner)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error occured");
        }
    })      
module.exports = router;