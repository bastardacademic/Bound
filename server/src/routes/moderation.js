const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { Report, Post, Comment, Group, User } = require("../models");

router.use(authMiddleware);

function requireModerator(req, res, next) {
  if (req.user.role !== "moderator" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

// A report is filed against a piece of content, not a user directly — resolve
// which user actually owns that content so a moderation action has someone to
// apply to.
async function resolveReportedUserId(report) {
  switch (report.content_type) {
    case "post": {
      const post = await Post.findByPk(report.content_id);
      return post?.author_id ?? null;
    }
    case "comment": {
      const comment = await Comment.findByPk(report.content_id);
      return comment?.user_id ?? null;
    }
    case "group": {
      const group = await Group.findByPk(report.content_id);
      return group?.created_by ?? null;
    }
    default:
      return null;
  }
}

// Submit a report
router.post("/", async (req, res) => {
  const { content_id, content_type, reason } = req.body;

  try {
    const report = await Report.create({
      reported_by: req.user.id,
      content_id,
      content_type,
      reason,
    });
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all reports for moderation — moderators/admins only, not every logged-in user
router.get("/", requireModerator, async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route PATCH /api/moderation/:id
// @desc Act on a report: dismiss it, warn the content's owner, or suspend them
router.patch("/:id", requireModerator, async (req, res) => {
  const { action, banDurationDays } = req.body;
  if (!["dismiss", "warn", "ban"].includes(action)) {
    return res.status(400).json({ message: "action must be one of dismiss, warn, ban" });
  }

  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (action === "dismiss") {
      report.status = "dismissed";
      report.moderated_by = req.user.id;
      await report.save();
      return res.json(report);
    }

    const reportedUserId = await resolveReportedUserId(report);
    if (!reportedUserId) {
      return res.status(409).json({ message: "The reported content no longer exists" });
    }

    const reportedUser = await User.findByPk(reportedUserId);
    if (!reportedUser) {
      return res.status(409).json({ message: "The reported user no longer exists" });
    }

    if (action === "warn") {
      reportedUser.warnings += 1;
    } else if (action === "ban") {
      const days = Number(banDurationDays) > 0 ? Number(banDurationDays) : 7;
      reportedUser.banned_until = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }
    await reportedUser.save();

    report.status = "resolved";
    report.moderated_by = req.user.id;
    await report.save();

    res.json({ report, action, user_id: reportedUser.id, warnings: reportedUser.warnings, banned_until: reportedUser.banned_until });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
