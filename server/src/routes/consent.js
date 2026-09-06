const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { Consent } = require("../models");

router.use(authMiddleware);

const VALID_TYPES = ["media-tag", "post-share", "group-invite"];

// @route GET /api/consent
// @desc List the current user's consent ledger
router.get("/", async (req, res) => {
  try {
    const ledger = await Consent.findAll({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(ledger);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route POST /api/consent
// @desc Record a consent entry for the current user
router.post("/", async (req, res) => {
  const { type, target_id, label } = req.body;

  if (!VALID_TYPES.includes(type) || !target_id || !label) {
    return res.status(400).json({ message: "type, target_id, and label are required" });
  }

  try {
    const entry = await Consent.create({
      user_id: req.user.id,
      type,
      target_id,
      label,
    });
    res.status(201).json(entry);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route PATCH /api/consent/:id/revoke
// @desc Revoke a previously given consent
router.patch("/:id/revoke", async (req, res) => {
  try {
    const entry = await Consent.findByPk(req.params.id);
    if (!entry || entry.user_id !== req.user.id) {
      return res.status(404).json({ message: "Consent entry not found" });
    }

    entry.revoked = true;
    await entry.save();
    res.json(entry);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
