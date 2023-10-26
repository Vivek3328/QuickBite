const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Order= require("../models/OrderModel");
const fetchuser = require("../Middlewares/fetchuser");

router.post("/checkout",fetchuser,async (req, res) => {
    try {
      const Item = req.body.item.map((item) => ({
        menuitem: item.menuitem, 
        quantity: item.quantity,
    }));

        order = await Order.create({
            user:req.user,
            owner:req.body.owner,
            item:Item,
            shipping:req.body.shipping,
            totalprice:req.body.totalprice,
            dateOrdered:req.body.dateOrdered,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success:false, error: "Some Error occured" });
    }
}
);


router.get('myorders/:ownerId', async (req, res) => {
  try {
      const ownerId = req.params.ownerId;
      const orders = await Order.find({ owner: ownerId });
      res.status(200).json(orders);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;