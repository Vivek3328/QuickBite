const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const registerUser = async (req, res) => {
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

    const data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    // console.log(authtoken);
    res.json({ authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check whether user with this email exist already
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Please, Try to login with correct credential" });
    }
    const pswdcompare = await bcrypt.compare(req.body.password, user.password);
    if (!pswdcompare) {
      // console.log( "Please, Try to login with correct credential" )
      return res
        .status(400)
        .json({ error: "Please, Try to login with correct credential" });
    }

    const data = {
      user: {
        id: user.id,
      },
    };
    // console.log(data, user);
    const authtoken = jwt.sign(data, JWT_SECRET);
    // console.log(authtoken);
    res.json({ authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
};

const getUser = async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
};

module.exports = { registerUser, loginUser, getUser };
