var express = require("express");
var router = express.Router();
const adminController = require("../controllers/admin");
const authAdminMiddleWare = require("../middlewares/authMiddleware");

router.post("/login", adminController.login);
router.post("/logout", authAdminMiddleWare, adminController.logout);
router.post(
  "/changeSettings",
  authAdminMiddleWare,
  adminController.changeSettings
);

router.get("/me", authAdminMiddleWare, adminController.getMe);

module.exports = router;
