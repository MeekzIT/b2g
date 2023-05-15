var express = require("express");
var router = express.Router();
const menuItemController = require("../controllers/menuItem");
const authAdminMiddleWare = require("../middlewares/authMiddleware");

router.post("/create", authAdminMiddleWare, menuItemController.create);
router.post("/edit", authAdminMiddleWare, menuItemController.edit);
router.post("/delete", authAdminMiddleWare, menuItemController.del);
router.get("/", menuItemController.getAll);
router.get("/:id", menuItemController.getSingle);
module.exports = router;
