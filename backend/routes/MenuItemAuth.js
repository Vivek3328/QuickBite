const express = require("express");
const fetchowner = require("../Middleware/fetchowner");
const { body, validationResult } = require("express-validator");
const MenuItem = require("../models/MenuItemModel");
const router = express.Router();

// Route-1 : POST Items using 'api/menuitemauth/additem'
router.post("/additem", fetchowner,
    [
        body("itemname", "Enter a valid Item Name").isLength({ min: 3 }),
        body("description", "Description must be of minimum 5 character").isLength({ min: 5 })
    ],
    async (req, res) => {
        try {
            const { itemname, description, price } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                  return res.status(400).json({ errors: errors.array() });
            }
            const item = new MenuItem({
                  itemname, description, price, owner: req.owner.id
            })
            const saveditem = await item.save();
            res.json(saveditem)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error occured");
        }
    }
);

// Route-2 : GET all menu items using 'api/menuitemauth/fetchallmenuitem'
router.get("/fetchallmenuitems", fetchowner, async (req, res) => {
    try {
        const items = await MenuItem.find({ owner: req.owner.id });
        res.json(items);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
});

// Route-3 : Delete Menu items using 'api/menuitemauth/deletemenuitem'
router.delete('/deletemenuitems/:id', fetchowner, async (req, res) => {
    let item = await MenuItem.findById(req.params.id);
    if(!item) { return res.status(404).send("Not Found") }
    
    //If Authenticated Id not matched with given id
    if(item.owner.toString() !== req.owner.id){
        return res.status(401).send("Not Allowed")
    }
    item = await MenuItem.findByIdAndDelete(req.params.id)
    res.json({"Success":"Menu Items Deleted Successfully"})
}
);


module.exports = router;