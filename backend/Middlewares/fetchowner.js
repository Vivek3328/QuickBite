const jwt = require("jsonwebtoken");
const JWT_SECRET = "Iamfine";
const fetchowner=(req,res,next)=>{

    //get the user from jwt token and Add Id to req object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: "Please authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        console.log(data)
        req.owner = data.owner;
        next();
      
    } catch (error) {
        res.status(401).send({error: "Please authenticate using a valid token"}
    )}
}
module.exports = fetchowner;