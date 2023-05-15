var express = require("express");
var router = express.Router();
const feedBackController = require("../controllers/feedback");
const authAdminMiddleWare = require("../middlewares/authMiddleware");

router.post("/", authAdminMiddleWare, feedBackController.create);
router.post("/delete", authAdminMiddleWare, feedBackController.destroy);
router.post(
  "/edit-actvity",
  authAdminMiddleWare,
  feedBackController.changeActivity
);
router.get("/", feedBackController.getFeedBacksOfMenuItem);

module.exports = router;
