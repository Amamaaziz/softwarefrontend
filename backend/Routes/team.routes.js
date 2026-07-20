const express = require("express");
const router = express.Router();
const { getPublicTeam } = require("../Controller/team.controller");

router.get("/", getPublicTeam);

module.exports = router;
