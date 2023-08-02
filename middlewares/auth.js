const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const authenticateUser = async(req, res, next) => {
    try {
        let token = req.headers.authorization;
        if(token.startsWith("Bearer ")){
            token = token.split(" ")[1];
            const user = jwt.verify(token, process.env.JWT_SECRET_STRING);
            const checkUser = await User.findById(user.id);
            if(checkUser){
                req.user = user;
                next();
            }else{
                return res.status(401).json("Unauthorized");
            }
        }
        else{
            return res.status(401).json("Unauthorized");
        }
    } catch (error) {
        return res.status(401).json("Unauthorized");
    }
    
}
module.exports = {authenticateUser};