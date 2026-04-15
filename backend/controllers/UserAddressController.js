const UserAddress = require("../models/UserAddressModel");

const listAddresses = async (req, res) => {
  try {
    const addresses = await UserAddress.find({ user: req.user.id })
      .sort({ isDefault: -1, updatedAt: -1 })
      .lean();
    return res.json({ success: true, addresses });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Could not load addresses" });
  }
};

const createAddress = async (req, res) => {
  try {
    const payload = { ...req.body, user: req.user.id };
    if (payload.isDefault) {
      await UserAddress.updateMany({ user: req.user.id }, { $set: { isDefault: false } });
    }
    const address = await UserAddress.create(payload);
    return res.status(201).json({ success: true, address });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Could not save address" });
  }
};

const updateAddress = async (req, res) => {
  try {
    const address = await UserAddress.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!address) {
      return res.status(404).json({ success: false, error: "Address not found" });
    }
    const allowed = [
      "label",
      "fullName",
      "phone",
      "line1",
      "line2",
      "city",
      "state",
      "pincode",
      "isDefault",
    ];
    for (const key of allowed) {
      if (req.body[key] !== undefined) address[key] = req.body[key];
    }
    if (req.body.isDefault) {
      await UserAddress.updateMany(
        { user: req.user.id, _id: { $ne: address._id } },
        { $set: { isDefault: false } }
      );
    }
    await address.save();
    return res.json({ success: true, address });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Could not update address" });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const result = await UserAddress.deleteOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: "Address not found" });
    }
    return res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, error: "Could not delete address" });
  }
};

module.exports = { listAddresses, createAddress, updateAddress, deleteAddress };
