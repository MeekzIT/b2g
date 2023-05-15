var express = require("express");
var router = express.Router();
const saleController = require("../controllers/sale");
const authAdminMiddleWare = require("../middlewares/authMiddleware");

router.post("/", authAdminMiddleWare, saleController.create);
router.post("/delete", authAdminMiddleWare, saleController.destroy);
router.post("/edit", authAdminMiddleWare, saleController.edit);

module.exports = router;
