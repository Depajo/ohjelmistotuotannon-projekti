const addressInfo = require("../models/voicecontrol");
const Joi = require('joi');
/**
 * getLocation 1st validates parameters it get's as request from /routes,
 * 2nd makes the database call with validated parameters.
 * Returns either data from database or statuscode:
 * 400 = Bad request, parameter validation failed
 * 204 = No content, database call didn't return data
 * 500 = Internal server error, something failed during sending data
 */

const getLocation = async (req, res) => {
	const schema = Joi.object({
		latitude: Joi.number().precision(7).required(),
		longitude: Joi.number().precision(7).required(),
	});
	const validation = schema.validate(req.params);
	if (validation.error) {
		res.status(400).send(validation.error.details[0].message);
		return;
	} else {
		const latitude = validation.value.latitude;
		const longitude = validation.value.longitude;
		try {
			const response = await addressInfo.findBy(latitude, longitude);
			if (response) {
				if (response.length == 0) {
					res.sendStatus(204);
				} else {
					res.send(response);
				}
			}
		} catch (e) {
        	res.sendStatus(500);
    	}
	}
};

module.exports = {
  getLocation,
};
