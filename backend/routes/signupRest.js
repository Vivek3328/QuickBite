const express = require("express");
const router = express.Router();
const Owner = require("../models/RestModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const fetchuser = require("../Middleware/fetchuser");
const JWT_SECRET = "Iamfine";

//ROUTE-1 : Register user using POST:"/api/userauth"
router.post("/registerowner",
    [
        body("email", "Enter a valid Email").isEmail(),
        body("name", "Enter a valid name").isLength({ min: 5 }),
        body("password", "Enter a valid password").isLength({ min: 6 }),
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
            res.status(500).send("Some error occured");
        }
    }
)

module.exports = router;