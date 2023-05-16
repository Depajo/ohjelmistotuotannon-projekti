const express = require("express");
const { getLocation } = require("../controllers/voicecontrol");
/**
 * router does GET request to database and calls getLocation()
 */
const router = express.Router();
router.get("/:latitude/:longitude", getLocation);

module.exports = router;
