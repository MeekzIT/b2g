var express = require("express");
var router = express.Router();
const ownerController = require("../controllers/owner");
const authAdminMiddleWare = require("../middlewares/authMiddleware");

router.post("/create", authAdminMiddleWare, ownerController.create);
router.post("/delete", authAdminMiddleWare, ownerController.deleteOwner);
router.post("/activity", authAdminMiddleWare, ownerController.ownerActivity);
router.get("/", authAdminMiddleWare, ownerController.getAll);
router.get("/:id", authAdminMiddleWare, ownerController.getSingle);

module.exports = router;
