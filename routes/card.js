var express = require("express");
var router = express.Router();
const cartController = require("../controllers/cart");
const userMiddleWare = require("../middlewares/userMiddleware");

router.post("/add-card", userMiddleWare, cartController.create);
router.post("/destroy-card", userMiddleWare, cartController.destroy);
router.get("/get-all", userMiddleWare, cartController.getCarts);
router.post("/change-default", userMiddleWare, cartController.edit);

module.exports = router;
