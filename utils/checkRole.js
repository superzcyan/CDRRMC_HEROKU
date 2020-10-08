const user = require("../models/user");

//Check user roles
const checkRole = (roles) => (request, response, next) =>
	!roles.includes(request.user.role)
		? response.status(401).json({ error: "Unauthorized user" })
		: next();

module.exports = { checkRole };
