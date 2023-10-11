const jwt = require("jsonwebtoken");
const JWT_SECRET = "Iamfine";

const fetchuser = async (req, res, next) => {
    //Get the user from jwt token and add id to object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({ error : "Please authenticate using valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        console.log(data.user)
        next();
    } catch (error) {
        res.status(401).send({ error : "Please authenticate using valid token" })
    }
}
module.exports = fetchuser; 