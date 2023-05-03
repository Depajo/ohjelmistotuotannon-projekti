const katutiedot = require("../models/voicecontrol");
const Joi = require('joi');

const getLocation = async (req, res) => {
	const schema = Joi.object({
		latitude: Joi.number().precision(7),
		longitude: Joi.number().precision(7),
	});
	const { error } = schema.validate(req.body);
	if (error) {
		res.status(400).send(error.details[0].message);
		return;
	}
	const latitude = req.params.latitude;
	const longitude = req.params.longitude;
	try {
		const response = await katutiedot.findBy(latitude, longitude);
		if (response) {
			res.send(response);
		}
	} catch (e) {
        res.sendStatus(500);
    }
};

module.exports = {
  getLocation,
};
