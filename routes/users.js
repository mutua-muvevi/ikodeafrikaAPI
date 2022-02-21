const express = require("express");
const router = express.Router();
const {protectAllUsers} = require("../middleware/auth")

const { allusers } = require("../controllers/users");

router.route("/").get(protectAllUsers, allusers);

module.exports = router;