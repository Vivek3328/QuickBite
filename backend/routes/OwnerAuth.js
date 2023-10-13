const express = require("express");
const router = express.Router();
const bodyParsar = require("body-parser")
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchowner = require("../Middlewares/fetchowner");
const JWT_SECRET = "Iamfine";
const controller = require("../controllers/appController");
const Owner = require("../models/OwnerModel");

router.use(bodyParsar.json());
router.use(bodyParsar.urlencoded({extended:true}));

const path=require('path')
const multer = require("multer");
router.use(express.static('uploads'))


// // Image configure
const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //where to store
      cb(null, path.join(__dirname,"../uploads"),function(error,success){
        if(error) throw error
      });
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  
  const upload = multer({
      storage: Storage,
      limits: {
        fileSize: 2048 * 2048 * 5,
      },
      fileFilter:(req, file, cb) => {
        //reject a file if it's not a jpg or png
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || mimetype === "image/jpg") 
          {
          cb(null, true);
          } else {
          cb(null, false);
        }
     } ,
    })

// Route to register a new owner
router.post("/registerowner",upload.single('Image'),controller.registerowner);
  


//Route-2: Login of Owner using POST:"/api/ownerauth/loginowner"
router.post("/loginowner",async (req, res) => {
        const {email,password} = req.body;
        let owner= await Owner.findOne({email:email});
        try{
            console.log(owner,email)
            if(!owner){
                return res
                    .status(400)
                    .json({ error: "email not found" });
            }
            const passwordCompare = await bcrypt.compare(password,owner.password);
            if(!passwordCompare){
                return res
                    .status(400)
                    .json({ error: "Invalid Password!" });
            }
            const data = {
                owner: {
                    id: owner.id,
                },
            };
            const authtoken = jwt.sign(data, JWT_SECRET);
            // console.log(authtoken);
            res.json({ authtoken });
        }catch (error){
            console.error(error.message);
            res.status(500).send("login failed");
        }
    }
);
module.exports = router;