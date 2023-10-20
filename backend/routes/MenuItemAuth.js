const express = require("express");
const fetchowner = require("../Middlewares/fetchowner");
const { body, validationResult } = require("express-validator");
const MenuItem = require("../models/MenuItemModel");
const router = express.Router();

const bodyParsar = require("body-parser")
router.use(bodyParsar.json());
router.use(bodyParsar.urlencoded({extended:true}));

const path=require('path')
const multer = require("multer");
router.use(express.static('uploads'))


// // // Image configure
// const Storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       //where to store
//       cb(null, path.join(__dirname,"../uploads"),function(error,success){
//         if(error) throw error
//       });
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + file.originalname);
//     },
//   });
  
//   const upload = multer({
//       storage: Storage,
//       limits: {
//         fileSize: 2048 * 2048 * 5,
//       },
//       fileFilter:(req, file, cb) => {
//         //reject a file if it's not a jpg or png
//         if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || mimetype === "image/jpg") 
//           {
//           cb(null, true);
//           } else {
//           cb(null, false);
//         }
//      } ,
//     })
// Route-1 : POST Items using 'api/menuitemauth/additem'
router.post("/additem", fetchowner,
    [
        body("itemname", "Enter a valid Item Name").isLength({ min: 3 }),
        body("description", "Description must be of minimum 5 character").isLength({ min: 5 })
    ],
    async (req, res) => {
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
            })
            const saveditem = await item.save();
            success=true;
            res.json({success:true, saveditem})
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
        console.log(req.owner)
        res.json(items);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
});

// Route-3 : GET Restaurant specific menu items using 'api/menuitemauth/fetchrestomenu/'
router.get("/fetchrestomenu/:id", async (req, res) => {
  try {
      const items = await MenuItem.find({ owner: req.params.id });
      console.log(items)
      res.json(items);
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
  }
});

// Route-4 : Delete Menu items using 'api/menuitemauth/deletemenuitem'
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