const { validationResult } = require("express-validator");
const Order = require("../models/OrderModel");

// Checkout API
const checkout = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Map items to correct structure
    const Item = req.body.item.map((item) => ({
      menuitem: item.menuitem,
      quantity: item.quantity,
    }));

    // Extract shipping details from the request body
    const shipping = {
      mobile: req.body.shipping.mobile,
      pincode: req.body.shipping.pincode,
      state: req.body.shipping.state,
      city: req.body.shipping.city,
      paymode: req.body.shipping.paymode,
    };

    // Create the order
    const order = await Order.create({
      user: req.user.id,
      owner: req.body.owner,
      item: Item,
      shipping: shipping,
      totalprice: req.body.totalprice,
      status: "Pending",
    });

    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error occurred" });
  }
};

// Get restaurant orders by ownerId
const restaurantOrders = async (req, res) => {
  try {
    const orders = await Order.find({ owner: req.owner.id })
      .populate("user")
      .populate("item.menuitem");
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error occurred" });
  }
};

// Get user orders by userId
const userOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("item.menuitem")
      .populate("owner");
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error occurred" });
  }
};

// Update order status
const updateStatus = async (req, res) => {
  const { status } = req.body;

  // Check if the status is valid
  const validStatuses = [
    "Pending",
    "Being Baked",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid status" });
  }

  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    // Update the order status
    order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    return res.json({ success: true, order });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error occurred" });
  }
};

module.exports = { checkout, restaurantOrders, userOrders, updateStatus };
