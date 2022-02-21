const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
	name : {
		type: String,
		minlength: [3, "The minimum character allowed is 3"],
		maxlength: [100, "The maximum character allowed is 100"],
		required: [true, "Please provide your full name"],
		unique: true
	},
	email: {
		type: String,
		minlength: [5, "The minimum character allowed is 5"],
		maxlength: [50, "The maximum character allowed is 50"],
		unique: true,
		required: [true, "Please provide an email address"],
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
	},
	location: {
		type: String,
		minlength: [5, "The minimum character allowed is 5"],
		maxlength: [50, "The maximum character allowed is 50"],
		required: [true, "Please provide your location"],
	},
	password: {
		type: String,
		minlength: [6, "The minimum length allowed is 6"],
		required: [true, "Please add a password"]
	},
	resetPasswordToken: String,
	resetPasswordExpiry: Date
})

// hashing the password
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")){
		next()
	}

	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

// signed token generation
UserSchema.methods.genSignToken = function () {
	return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRY
	})
}

// matching password
UserSchema.methods.matchPassword = async function(password) {
	return await bcrypt.compare(password, this.password)
}

// the model
const User = mongoose.model("user", UserSchema)

module.exports = User