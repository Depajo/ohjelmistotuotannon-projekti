const katutiedot = require("../models/voicecontrol");
/*
const getKatutiedot = async (req, res) => {
  const response = await katutiedot.findAll();
  if (response) {
    res.send(response);
  }
};
*/
const getBy = async (req, res) => {
  const latitude = req.params.latitude;
  const longitude = req.params.longitude
  const response = await katutiedot.findBy(latitude, longitude);
  if (response) {
    res.send(response);
  }
};

module.exports = {
  //getKatutiedot,
  getBy,
};
