const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const evacueesSchema = new mongoose.Schema({
	familyNumber: {
		type: Number,
		required: true,
		default: 1,
	},
	evacueeNumber: {
		type: Number,
		required: true,
		default: 1,
	},
	memberType: {
		type: String,
		required: true,
	},
	firstName: {
		type: String,
		required: true,
	},
	middleName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	birthday: {
		type: Date,
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
	gender: {
		type: String,
		required: true,
	},
	pregnant: {
		type: Boolean,
		required: true,
		default: false,
	},
	address: {
		type: String,
		required: true,
	},
	baranggay: {
		type: String,
		required: true,
	},
	municipality: {
		type: String,
		required: true,
	},
	pwd: {
		type: Boolean,
		required: true,
		default: false,
	},
	contactNumber: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
});
evacueesSchema.plugin(AutoIncrement, { inc_field: "evacueeNumber" });
module.exports = mongoose.model("evacuees", evacueesSchema);
