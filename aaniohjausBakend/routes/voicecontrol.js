const express = require("express");
const { getKatutiedot, getBy } = require("../controllers/voicecontrol");

const router = express.Router();

router.get("/", getKatutiedot);
router.get("/:select", getBy);

module.exports = router;
