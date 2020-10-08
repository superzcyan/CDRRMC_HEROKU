const router = require("express").Router();
const municipalityModel = require("../models/municipality");
const { request, response } = require("express");
const verify = require("../utils/verifyToken");

//Retrieve list of municipalities
router.get("/", verify, async (request, response) => {
	try {
		const municipality = await municipalityModel.find();
		response.status(200).json(municipality);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//Insert new municipality
router.post("/", verify, async (request, response) => {
	const addedMunicipality = new municipalityModel({
		name: request.body.name,
	});
	try {
		const newMunicipality = await addedMunicipality.save();
		response.status(200).json(newMunicipality);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//Update municipality
router.patch("/:id", verify, async (request, response) => {
	try {
		const municipality = await municipalityModel.findById(request.params.id);
		municipality.name = new request.body.name();
		const updatedMunicipality = await municipality.save();
		response.status(200).json(updatedMunicipality);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//Delete municipality
router.delete("/:id", verify, async (request, response) => {
	try {
		const municipality = await municipalityModel.findById(request.params.id);
		const deletedMunicipality = await municipality.remove();
		response.status(200).json(deletedMunicipality);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

module.exports = router;
