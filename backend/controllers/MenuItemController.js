const { body, validationResult } = require("express-validator");
const MenuItem = require("../models/MenuItemModel");
const OwnerModel = require("../models/OwnerModel");

const addItem = async (req, res) => {
  let success = false;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    const item = new MenuItem({
      owner: req.owner.id,
      itemname: req.body.itemname,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image,
    });
    const saveditem = await item.save();
    success = true;
    res.json({ success: true, saveditem });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
};

const allmenuitems = async (req, res) => {
  try {
    const ownerdata = await OwnerModel.findById(req.owner.id);
    // console.log(ownerdata)
    const items = await MenuItem.find({ owner: req.owner.id });
    // console.log(req.owner)
    res.json({ items, name: ownerdata.name });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
};

const restaurantMenu = async (req, res) => {
  try {
    const items = await MenuItem.find({ owner: req.params.id });
    //   console.log(items)
    res.json(items);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
};

const updateMenuItem = async (req, res) => {
  try {
    // Find the menu item by its ID
    let item = await MenuItem.findById(req.params.id);

    // If item not found, return 404
    if (!item) {
      return res.status(404).send("Menu Item Not Found");
    }

    // Ensure that the item belongs to the logged-in owner
    if (item.owner.toString() !== req.owner.id) {
      return res.status(401).send("Not Authorized");
    }

    // Update item details from the request body
    const updatedFields = {
      itemname: req.body.itemname || item.itemname,
      description: req.body.description || item.description,
      price: req.body.price || item.price,
      image: req.body.image || item.image,
    };

    // Update the item in the database
    item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    // Return the updated item
    res.json({ success: true, updatedItem: item });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occurred");
  }
};

const deleteMenuItem = async (req, res) => {
  let item = await MenuItem.findById(req.params.id);
  if (!item) {
    return res.status(404).send("Not Found");
  }

  if (item.owner.toString() !== req.owner.id) {
    return res.status(401).send("Not Allowed");
  }
  item = await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ Success: "Menu Items Deleted Successfully" });
};

module.exports = {
  addItem,
  allmenuitems,
  restaurantMenu,
  updateMenuItem,
  deleteMenuItem,
};
