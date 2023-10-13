const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser = require("../Middlewares/fetchuser");
const JWT_SECRET = "Iamfine";

//ROUTE-1 : Register user using POST:"/api/userauth"
router.post("/registeruser",
    [
        body("email", "Enter a valid Email").isEmail(),
        body("name", "Enter a valid name").isLength({ min: 5 }),
        body("password", "Enter a valid password").isLength({ min: 4 }),
    ],
    async (req, res) => {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            // Check whether user with this email exist already
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res
                    .status(400)
                    .json({ error: "User with this Email already exist" });
            }
            const salt = await bcrypt.genSalt(10);
            const secpass = await bcrypt.hash(req.body.password, salt);
            user = await User.create({
                name: req.body.name,
                password: secpass,
                email: req.body.email,
            });
            //we return token instead of id
            const data = {
                user: {
                    id: user.id,
                },
            };
            const authtoken = jwt.sign(data, JWT_SECRET);
            console.log(authtoken);
            res.json({ authtoken });
            // res.json(user)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some error occured");
        }
    }
);

//ROUTE-2 : Login user using POST:"/api/userauth/loginuser". No login required
router.post("/loginuser",
    [
        body("email", "Enter a valid Email").isEmail(),
        body("password", "Enter a valid password").isLength({ min: 4 }),
    ],
    async (req, res) => {
        console.log(req.body);
        //If there are error return bad request or error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // const { email , password } = req.body;

        try {
            // Check whether user with this email exist already
            let user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).json({ error: "Please, Try to login with correct credential" });
            }
            const pswdcompare = await bcrypt.compare(req.body.password, user.password);
            if(!pswdcompare){
                return res.status(400).json({ error: "Please, Try to login with correct credential" });
            }
            //we return token instead of id
            const data = {
                user: {
                    id: user.id,
                },
            };
            // console.log(data, user);
            const authtoken = jwt.sign(data, JWT_SECRET);
            console.log(authtoken);
            res.json({ authtoken });
            // res.json(user);
        } 
        catch (error) {
            console.error(error.message);
            res.status(500).send("Some error occured");
        }

    }
);

// ROUTE-3 : GET LOGGEDIN USER DETAILS using using POST:"/api/userauth/getuser". Login required
//fetchuser callback used to authorize token
router.post("/getuser", fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        console.log(userId)
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
})

module.exports = router;