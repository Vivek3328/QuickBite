const express = require( "express");
const Restaurant = require('../models/Restaurant');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.post('/',(req, res) => {
    console.log(req.body);
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }
    // Restaurant.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    // }).then(user => res.json(user)).catch(err=>{console.log(err)
    // res.json({error:'Please Enter unique Value'})})
})
module.exports = router