const { validationResult } = require("express-validator");
const Owner = require("../models/OwnerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const registerOwner = async (req, res) => {
  let success = false;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {
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
      address: req.body.address,
      restaurantType: req.body.restaurantType,
      pincode: req.body.pincode,
      mobile: req.body.mobile,
      foodtype: req.body.foodtype,
      image: req.body.image,
    });

    const data = {
      owner: {
        id: owner.id,
      },
    };

    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    return res.json({ success: true, authtoken });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Some Error occured" });
  }
};

const loginOwner = async (req, res) => {
  let success = false;
  const { email, password } = req.body;
  let owner = await Owner.findOne({ email: email });
  try {
    // console.log(owner, email)
    if (!owner) {
      return res.status(400).json({ success, error: "email not found" });
    }
    const passwordCompare = await bcrypt.compare(password, owner.password);
    if (!passwordCompare) {
      return res.status(400).json({ success, error: "Invalid Password!" });
    }
    const data = {
      owner: {
        id: owner.id,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);

    success = true;
    return res.json({ success, authtoken });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("login failed");
  }
};

const fetchAllOwner = async (req, res) => {
  try {
    const items = await Owner.find({});
    return res.json(items);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal server error occured");
  }
};

module.exports = { registerOwner, loginOwner, fetchAllOwner };
