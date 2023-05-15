var express = require("express");
var router = express.Router();
const pointController = require("../controllers/point");
const authAdminMiddleWare = require("../middlewares/authMiddleware");

router.post("/create", authAdminMiddleWare, pointController.create);
router.post("/delete", authAdminMiddleWare, pointController.deletePoint);
router.post("/activity", authAdminMiddleWare, pointController.pointActivity);
router.get("/", authAdminMiddleWare, pointController.getAll);
router.get("/:id", authAdminMiddleWare, pointController.getSingle);

module.exports = router;
