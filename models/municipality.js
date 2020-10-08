const mongoose = require("mongoose");

const municipalitySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("municipality", municipalitySchema);
