const express = require("express");
const router = express.Router();
const { isAdmin } = require("../Middleware/auth.middleware");
const {
  listTeam,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  publishTeamMember,
  deleteTeamMember,
} = require("../Controller/team.controller");

router.use(isAdmin);
router.get("/", listTeam);
router.get("/:id", getTeamMember);
router.post("/", createTeamMember);
router.patch("/:id", updateTeamMember);
router.patch("/:id/publish", publishTeamMember);
router.delete("/:id", deleteTeamMember);

module.exports = router;
