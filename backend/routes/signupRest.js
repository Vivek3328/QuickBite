const express = require('express');
const Owner = require('../models/Restaurant');
const router = express.Router();
const {body, validationResult } = require('express-validator');

router.post('/', [
    body('name','Enter valid name').isLength({ min: 3 }),
    body('email','Enter valid email').isEmail(),
    body('password','Enter valid password').isLength({ min: 6 }),
],(req, res) => {
    const errors = validationResult(req);    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    Owner.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }).then(user => res.json(user))
    .catch(err=>{console.log(err)
    res.json({error:'Please Enter unique Value'})})
})
module.exports = router