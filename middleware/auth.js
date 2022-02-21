const jwt  = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user")

exports.protectAllUsers = async (req, res, next) => {
    let token;

    // checking the headers
    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
        return next(new ErrorResponse("Not authorized", 403))
    }

    try {
        const decoded = jwt.decode(token, process.env.JWT_SECRET)

        // finding that decoded user
        const user = await User.findOne(decoded.id)

        if (!user) {
            return next(new ErrorResponse("No user found with this id", 404))
        }

        req.user = user
        next()
    }
    catch (error) {
        return next(new ErrorResponse("Not authorized", 401))
    }
}