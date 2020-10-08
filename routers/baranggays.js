const router = require("express").Router();
const brgyModel = require("../models/baranggays");
const { request, response } = require("express");
const verify = require("../utils/verifyToken");

//Retrieve list of baranggays
router.get("/", verify, async (request, response) => {
	try {
		const brgys = await brgyModel.find();
		response.status(200).json(brgys);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//Insert new baranggay
router.post("/", verify, async (request, response) => {
	const newBrgy = new brgyModel({
		name: request.body.name,
	});
	try {
		const brgy = await newBrgy.save();
		response.status(200).json(brgy);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//Update baranggay
router.patch("/:id", verify, async (request, response) => {
	try {
		const brgy = await brgyModel.findById(request.params.id);
		brgy.name = new request.body.name();
		const updatedBrgy = await brgy.save();
		response.status(200).json(updatedBrgy);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//Delete baranggay
router.delete("/:id", verify, async (request, response) => {
	try {
		const brgy = await brgyModel.findById(request.params.id);
		const deletedBrgy = await brgy.remove();
		response.status(200).json(deletedBrgy);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

module.exports = router;
