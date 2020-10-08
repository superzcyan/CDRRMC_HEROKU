const mongoose = require("mongoose");
const { string } = require("@hapi/joi");
const familyNumberSchema = new mongoose.Schema({
	name: {
		type: String,
		default: "familyNumber",
	},
	count: {
		type: Number,
		required: true,
		default: 0,
	},
});
module.exports = mongoose.model("counters", familyNumberSchema);
