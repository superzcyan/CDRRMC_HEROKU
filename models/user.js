const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		min: 3,
	},
	userName: {
		type: String,
		required: true,
		min: 3,
	},
	role: {
		type: String,
		required: true,
		default: "user",
	},
	password: {
		type: String,
		required: true,
		min: 6,
	},
});

module.exports = mongoose.model("user", userSchema);
