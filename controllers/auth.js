const User = require("../models/user")
const ErrorResponse = require("../utils/errorResponse")

exports.register = async (req, res, next) => {

	const {name, email, location, password } = req.body

	try {
		const user = await User.create({
			name,
			email,
			location,
			password
		})

		
		sendToken(user, 201, res)
	
	} catch (error) {
		next(error)
	}
}

exports.login = async (req, res, next) => {
	const {email, password} = req.body

	// checking if the fields exists
	if (!email || !password) {
		return next(new ErrorResponse("Please provide an email and password", 400));
	}

	try {
		// check if the user exists
		const user = await User.findOne({email}).select("+password");

		if (!user) {
			return next(new ErrorResponse("Invalid credentials", 401))
		}

		// Check if password matches
		const isMatch = await user.matchPassword(password)
		
		if (!isMatch) {
			return next(new ErrorResponse("Invalid credentials", 400))
		}

		sendToken(user, 200, res)

	} catch (error) {
		next(error)
	}


}

exports.forgotPassword = async (req, res, next) => {
	res.send("forgot password")
}

exports.resetPassword = async (req, res, next) => {
	res.send("reset password")
}

const sendToken = (user, statusCode, res) => {
	const token = user.genSignToken()
	res.status(statusCode).json({
		success: true,
		token
	})
}