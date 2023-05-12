const katutiedot = require("../models/voicecontrol");
const Joi = require('joi');

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
			const response = await katutiedot.findBy(latitude, longitude);
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
