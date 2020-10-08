//Validation
const Joi = require("@hapi/joi");
const { allow } = require("@hapi/joi");

//Registration Validation
const registrationValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().required().messages({
			"string.empty": `Name is required`,
		}),
		role: Joi.string().required().messages({
			"string.empty": `Role is required`,
		}),
		userName: Joi.string().min(4).required().messages({
			"string.empty": `Username is required`,
			"string.min": `Username should be atleast 4 characters`,
		}),
		password: Joi.string().min(4).required().messages({
			"string.empty": `Password number is required`,
			"string.min": `Password should be atleast 4 characters`,
		}),
		passwordCheck: Joi.string().required().messages({
			"string.empty": `Confirm Password confirmation does not match.`
		})
	});
	return schema.validate(data, { abortEarly: false });
};

//Login Validation
const loginValidation = (data) => {
	const schema = Joi.object({
		userName: Joi.string().min(4).required().messages({
			"string.empty": `Username is empty`,
		}),
		password: Joi.string().min(4).required().messages({
			"string.empty": `Password is empty`,
		}),
	});
	return schema.validate(data, { abortEarly: false });
};

//Evacuee Validation
const evacueeValidation = (data) => {
	const schema = Joi.object().keys({
		familyNumber: Joi.number().required().messages({
			"number.empty": `Family number is required`,
		}),
		memberType: Joi.string().trim().required().messages({
			"string.empty": `Member type is missing`,
		}),
		firstName: Joi.string().trim().required().messages({
			"string.empty": `First name is required`,
		}),
		middleName: Joi.string().trim().required().messages({
			"string.empty": `Middle name is required`,
		}),
		lastName: Joi.string().trim().required().messages({
			"string.empty": `Last name is required`,
		}),
		//birthday: Joi.string().optional(),
		birthday: Joi.string().required().messages({
			"string.empty": `Birthday is required`,
		}),
		age: Joi.number().required().messages({
			"number.base": `Age should be numeric`,
			"number.empty": `Age is required`,
		}),
		gender: Joi.string().trim().required().messages({
			"string.empty": `Gender is required`,
		}),
		pregnant: Joi.boolean().optional().messages({
			"boolean.base": `Pregnant status should only be true or false`,
		}),
		address: Joi.string().trim().required().messages({
			"string.empty": `Address is required`,
		}),
		baranggay: Joi.string().trim().required().messages({
			"string.empty": `Baranggay is required`,
		}),
		municipality: Joi.string().trim().required().messages({
			"string.empty": `Municipality is required`,
		}),
		pwd: Joi.boolean().required().messages({
			"boolean.empty": `Status is required`,
		}),
		contactNumber: Joi.number()
			.empty("")
			.allow(null)
			.min(0)
			.required()
			.messages({
				"number.base": `Contact number should be all numeric`,
				"any.required": `Contact number is required asf`,
			}),
		file: Joi.string().required().messages({
			"string.base": `No image selected`,
			"string.empty": `No image selected`,
		}),
		familyMember: Joi.array().optional(),
	});
	return schema.validate(data, { abortEarly: false });
};

module.exports.registrationValidation = registrationValidation;
module.exports.loginValidation = loginValidation;
module.exports.evacueeValidation = evacueeValidation;
