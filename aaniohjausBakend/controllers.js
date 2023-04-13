const katutiedot = require("./model");

const getKatutiedot = async (req, res) => {
  const response = await katutiedot.findAll();
  if (response) {
    res.send(response);
  }
};
const getBy = async (req, res) => {
  const select = req.query;
  const response = await katutiedot.findBy(select);
  if (response) {
    res.send(response);
  }
};

module.exports = {
  getKatutiedot,
  getBy,
};
