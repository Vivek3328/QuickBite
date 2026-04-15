const MenuItem = require("../models/MenuItemModel");
const OwnerModel = require("../models/OwnerModel");

const addItem = async (req, res) => {
  let success = false;
  try {
    const item = new MenuItem({
      owner: req.owner.id,
      itemname: req.body.itemname,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image,
      isVeg: req.body.isVeg !== false,
      isOutOfStock: Boolean(req.body.isOutOfStock),
      prepTimeMin: req.body.prepTimeMin != null ? Number(req.body.prepTimeMin) : undefined,
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
    return res.json({
      items,
      name: ownerdata.name,
      deliveryEtaMin: ownerdata.deliveryEtaMin,
      location: ownerdata.location,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal server error occured");
  }
};

const restaurantMenu = async (req, res) => {
  try {
    const items = await MenuItem.find({ owner: req.params.id });
    //   console.log(items)
    return res.json(items);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal server error occured");
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
    if (typeof req.body.isVeg === "boolean") updatedFields.isVeg = req.body.isVeg;
    if (typeof req.body.isOutOfStock === "boolean") updatedFields.isOutOfStock = req.body.isOutOfStock;
    if (req.body.prepTimeMin != null && req.body.prepTimeMin !== "") {
      const p = Number(req.body.prepTimeMin);
      if (Number.isFinite(p)) updatedFields.prepTimeMin = p;
    }

    // Update the item in the database
    item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    // Return the updated item
    return res.json({ success: true, updatedItem: item });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal server error occurred");
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
  return res.json({ Success: "Menu Items Deleted Successfully" });
};

const toggleMenuStock = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: "Menu item not found" });
    }
    if (item.owner.toString() !== req.owner.id) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }
    const next = typeof req.body.isOutOfStock === "boolean" ? req.body.isOutOfStock : !item.isOutOfStock;
    const updated = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { $set: { isOutOfStock: next } },
      { new: true }
    );
    return res.json({ success: true, item: updated });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Internal server error occurred" });
  }
};

module.exports = {
  addItem,
  allmenuitems,
  restaurantMenu,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuStock,
};
