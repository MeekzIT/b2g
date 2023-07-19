var express = require("express");
var router = express.Router();
const basketController = require("../controllers/basket");
const userMiddleWare = require("../middlewares/userMiddleware");

router.post("/add", userMiddleWare, basketController.create);
router.post("/destroy", userMiddleWare, basketController.destroy);
router.get("/", userMiddleWare, basketController.getAll);
router.post("/edit", userMiddleWare, basketController.edit);

module.exports = router;
