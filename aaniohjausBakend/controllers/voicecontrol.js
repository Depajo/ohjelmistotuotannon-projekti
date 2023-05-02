const katutiedot = require("../models/voicecontrol");

const getLocation = async (req, res) => {
  const latitude = req.params.latitude;
  const longitude = req.params.longitude;
  const response = await katutiedot.findBy(latitude, longitude);
  if (response) {
    res.send(response);
  }
};

module.exports = {
  getLocation,
};
