const express = require("express");
const moment = require("moment");
const fileUpload = require("express-fileupload");
const router = express.Router();
const evacueesModel = require("../models/evacuees");
const counterModel = require("../models/counter");
const verify = require("../utils/verifyToken");
const { checkRole } = require("../utils/checkRole");
const { evacueeValidation } = require("../utils/validation");
const fs = require("fs");
const multer = require("multer");
const upload = multer();
const fileSystem = require("fs");
const { promisify } = require("util");
const { decodeBase64 } = require("bcryptjs");
const pipeline = promisify(require("stream").pipeline);
require("dotenv/config");

//GET all registered evacuees from database
router.get("/", verify, async (request, response) => {
	try {
		const evacuees = await evacueesModel.find();
		response.status(200).json(evacuees);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//GET evacuee head images from public\images folder -- separated
router.get("/evacuees", (request, response) => {
	response.sendFile(path.join(__dirname, "app_data"));
	//sample use - localhost:5000/images/imgName.jpg
});

//Retrieve new family number for new family head.r
router.get("/familyNumber", verify, async (request, response) => {
	try {
		const familyNumber = await counterModel.find({ name: "familyNumber" });
		console.log("familyNumber:", familyNumber);
		response.status(200).json(familyNumber[0].count + 1); //Get key:value pair of json object

		const evacueeNumber = await counterModel.find({ id: "evacueeNumber" });
		console.log("evacueeNumber:", evacueeNumber[0].seq);
	} catch (error) {
		response.status(500).json({ error: error.message });
		console.log(error);
	}
});

//Insert new evacuee to the database
router.post("/", verify, checkRole(["admin"]), async (request, response) => {
	//Validation Check
	const error = [];
	const validation = evacueeValidation(request.body);
	//response.status(500).send(validation);
	if (validation.error) {
		const splitError = validation.error.message.split(".");
		splitError.forEach((splitError) => {
			error.push({ errorMsg: splitError });
		});
	}
	//Find latest familyNumber

	const latestFamilyNumber = await counterModel.find({ name: "familyNumber" });
	console.log(latestFamilyNumber);
	const familyNumber = latestFamilyNumber[0].count + 1;

	const latestEvacuee = await evacueesModel
		.findOne()
		.sort({ _id: -1 })
		.limit(1);
	const evacueeNumber = latestEvacuee.evacueeNumber + 1;

	//Compute age using birthday
	const yearToday = new Date().getFullYear();
	//Transform mongoose Date field to UTC using moment
	const birthday = moment(request.body.birthday, "MM-DD-yyyy");
	const birthYear = new Date(birthday).getFullYear();
	const age = yearToday - birthYear;

	const imgdata = request.body.file;
	const imgName = request.body.firstName + "_" + evacueeNumber + ".jpg";

	const newEvacuee = new evacueesModel({
		familyNumber: familyNumber,
		memberType: request.body.memberType,
		firstName: request.body.firstName,
		middleName: request.body.middleName,
		lastName: request.body.lastName,
		birthday: request.body.birthday,
		age: age,
		gender: request.body.gender,
		pregnant: request.body.pregnant,
		address: request.body.address,
		baranggay: request.body.baranggay,
		municipality: request.body.municipality,
		pwd: request.body.pwd,
		contactNumber: request.body.contactNumber,
		image: imgName,
	});

	//Upload images to server
	// to convert base64 format into random filename
	const base64Data =
		imgdata === null || imgdata === undefined
			? ""
			: imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, "");

	//Save family members
	const familyMembers = request.body.familyMember;
	try {
		if (error.length > 0) {
			//console.log(error);
			response.status(400).json(error);
		} else {
			// to declare some path to store your converted image
			const path = `${__dirname}/../app_data/images/${imgName}`;
			console.log(newEvacuee.image);
			fs.writeFileSync(path, base64Data, { encoding: "base64" });
			const evacuee = await newEvacuee.save();
			if (familyMembers.length > 0) {
				try {
					const latestFamilyNumber = await counterModel.find({
						name: "familyNumber",
					});
					console.log(latestFamilyNumber);
					const familyNumber = latestFamilyNumber[0].count + 1;
					//Add Family member
					familyMembers.forEach((x) => {
						//Compute age using birthday
						const yearToday = new Date().getFullYear();
						//Transform mongoose Date field to UTC using moment
						const birthday = moment(x.birthday, "MM-DD-yyyy");
						const birthYear = new Date(birthday).getFullYear();
						const age = yearToday - birthYear;
						const membersModel = new evacueesModel({
							familyNumber: familyNumber,
							evacueeNumber: x.evacueeNumber,
							memberType: x.memberType,
							firstName: x.firstName,
							middleName: x.middleName,
							lastName: x.lastName,
							birthday: x.birthday,
							age: age,
							gender: x.gender,
							pregnant: x.pregnant,
							address: x.address,
							baranggay: x.baranggay,
							municipality: x.municipality,
							pwd: x.pwd,
							contactNumber: x.contactNumber,
							image: "default.jpg",
						});
						const member = membersModel.save();
					});

					//Update numbers of family in counters collection
					//Find familyNumber in mongo collections
					const famNumber = await counterModel.find({
						name: "familyNumber",
					});
					const familyCount = famNumber[0].count;
					const filter = { name: "familyNumber" };
					//add count to familyNumber
					const update = { count: familyCount + 1 };
					await counterModel.updateOne(filter, update);
					console.log("update:", update);
				} catch (error) {
					console.log("Error", error);
				}
			}
			response.status(200).json("success");
		}
	} catch (error) {
		response.status(500).json({ error: error });
	}
});

//Update numbers of family in counters collection --separated
router.put("/familyNumber", verify, async (request, response) => {
	try {
		const familyNumber = await counterModel.find({ name: "familyNumber" });
		response.json(familyNumber);
		const familyCount = familyNumber[0].count;
		const filter = { name: "familyNumber" };
		const update = { count: familyCount + 1 };
		await counterModel.updateOne(filter, update);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//Update registered evacuee from the database based on id
router.patch("/:id", verify, async (request, response) => {
	try {
		const evacuee = await evacueesModel.findById(request.params.id);
		const updates = request.body;
		const options = { new: true };
		const updatedEvacuee = await evacueesModel.findByIdAndUpdate(
			evacuee,
			updates,
			options
		);
		response.status(200).json(updatedEvacuee);
	} catch (error) {
		response.status(500).json({ error: "Error" });
	}
});

//Delete registered evacuee from the database based on id
router.delete("/:id", verify, async (request, response) => {
	try {
		const evacuee = await evacueesModel.findById(request.params.id);
		const deletedEvacuee = await evacuee.delete();
		response.status(200).json(deletedEvacuee);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//Upload Image to server -- separated
router.post(
	"/upload",
	upload.single("file"),
	async (request, response, next) => {
		const file = request.file;
		const name = request.body.name;
		// const {
		//   file,
		//   body: { name }
		// } = req.body;

		//Check extension name and only accept jpg
		if (request.file != undefined) {
			const extensionName = file.detectedFileExtension;
			if (extensionName != ".jpg") {
				response.status(500).json({ error: "Invalid File Type" });
			} else {
				const fileName = name + extensionName;
				await pipeline(
					file.stream,
					fileSystem.createWriteStream(
						`${__dirname}/../public/images/${fileName}`
					)
				);
				response.status(200).json({ message: "File Uploaded" });
			}
		} else {
			response.status(500).json({ error: "No File Selected" });
		}
	}
);

module.exports = router;
