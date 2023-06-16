var express = require("express");
var router = express.Router();
const userController = require("../controllers/user");
const cartController = require("../controllers/cart");
const authAdminMiddleWare = require("../middlewares/authMiddleware");
const userMiddleWare = require("../middlewares/userMiddleware");

//user routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userMiddleWare, userController.logout);
router.post("/edit", userMiddleWare, userController.edit);
router.get("/me", userMiddleWare, userController.getMe);
//forgot password
router.post("/get-code", userController.conformPasswordAddCode);
router.post("/verify-code", userController.checkVerifyCode);
router.post("/new-password", userController.newPassword);
//admin router
router.post("/block", authAdminMiddleWare, userController.blockUser);
router.get("/", authAdminMiddleWare, userController.getAll);
router.post("/:id", authAdminMiddleWare, userController.getSingle);
//user carts
router.post("/add-cart", userMiddleWare, cartController.create);
router.post("/destroy-cart", userMiddleWare, cartController.destroy);
router.get("/carts", userMiddleWare, cartController.getCarts);

module.exports = router;
