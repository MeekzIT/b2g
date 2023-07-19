var express = require("express");
var router = express.Router();
const orderController = require("../controllers/order");
const authAdminMiddleWare = require("../middlewares/authMiddleware");
const authMiddleWare = require("../middlewares/userMiddleware");

router.post("/check-card", authMiddleWare, orderController.checkCard);
router.post("/check-code", authMiddleWare, orderController.checkCode);
router.get("/point-orders", authAdminMiddleWare, orderController.pointOrders);
router.get("/", authMiddleWare, orderController.getMyOrders);
router.post("/take-order", authAdminMiddleWare, orderController.takeOrder);

module.exports = router;
