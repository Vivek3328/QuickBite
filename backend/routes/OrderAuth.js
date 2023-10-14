const express = require("express");
const fetchuser = require("../Middlewares/fetchuser");
const { body, validationResult } = require("express-validator");
const OrderItem = require("../models/OrderModel");
const router = express.Router();

// Route-1 : POST Items using 'api/orderauth/placeorder'
router.post("/placeorder", fetchuser, async (req, res) => {
        try {
            const { ownerId, quantity, totalprice , menuitem} = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                  return res.status(400).json({ errors: errors.array() });
            }
            const item = new OrderItem({
                ownerId, quantity, totalprice, menuitem, user: req.user.id
            })
            const saveditem = await item.save();
            res.json(saveditem)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error occured");
        }
    }
);

module.exports = router;