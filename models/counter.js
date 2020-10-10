const mongoose = require("mongoose");
const { string } = require("@hapi/joi");
const counterSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	count: {
		type: Number,
		required: true,
		default: 0,
	},
});
module.exports = mongoose.model("counters", counterSchema);
