const express = require("express");
const {getLocation} = require("../controllers/voicecontrol");

const router = express.Router();

router.get("/:latitude/:longitude", getLocation);

module.exports = router;
