const router = require("express").Router();
const bcrypt = require("bcryptjs");
const verify = require("../utils/verifyToken");
const userModel = require("../models/user");
const { registrationValidation } = require("../utils/validation");

//Insert new user to the database
router.post("/", async (request, response) => {
	//Validate before creating
	const { error } = registrationValidation(request.body);
	if (error) return response.status(400).send(error.details[0].message);

	//Check if username exist
	const userNameExist = await userModel.findOne({
		userName: request.body.userName,
	});
	if (userNameExist)
		return response.status(400).json({ message: "Username already exist" });

	if (request.body.password !== request.body.passwordCheck)
		return response.status(400).json({message: "The Confirm Password confirmation does not match."});

	//Hash passwords
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(request.body.password, salt);

	//Create new user
	const newUser = new userModel({
		name: request.body.name,
		userName: request.body.userName,
		role: request.body.role,
		password: hashedPassword,
	});
	try {
		const user = await newUser.save();
		response.status(200).json({ user: user.userName });
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

router.put("/:id", verify, async (request, response) => {
	try {
		const user = await userModel.findById(request.params.id);
		const updates = request.body;
		const options = { new: true };
		const updatedUser = await userModel.findByIdAndUpdate(
			user,
			updates,
			options
		);
		response.status(200).json(updatedUser);
	} catch (error) {
		response.status(500).json({ error: "Error" });
	}
});

//List of Users
router.get("/", verify, async (request, response) => {
	try {
		const users = await userModel.find();
		response.status(200).json(users);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

//Delete user from the database based on id
router.delete("/:id", verify, async (request, response) => {
	try {
		const user = await userModel.findById(request.params.id);
		const deletedUser = await user.delete();
		response.status(200).json(deletedUser);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

module.exports = router;
