const Cart = require("../models").Card;

const create = async (req, res) => {
  try {
    const { accountNumber, expiry, name } = req.body;
    const { user_id } = req.user;
    const cart = await Cart.findAll({ where: { userId: user_id } });
    if (cart.length >= 5) {
      return res.json({ succes: false, error: "max count of dard is a 5" });
    } else {
      const haveCart = await Cart.findAll({ where: { userId: user_id } });
      await Cart.create({
        userId: user_id,
        accountNumber: accountNumber.slice(12, 17),
        expiry,
        name,
        defaultCard: haveCart.length > 0 ? false : true,
      });
      return res.json({ succes: true });
    }
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.body;
    const cart = await Cart.findOne({ where: { id } });
    await cart.destroy();
    return res.json({ succes: true });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const edit = async (req, res) => {
  try {
    const { id, defaultCard } = req.body;
    const { user_id } = req.user;
    const allCart = await Cart.findAll({ where: { userId: user_id } });
    await allCart.map(async (c) => {
      c.defaultCard = false;
      await c.save();
    });
    const cart = await Cart.findOne({ where: { id } });
    cart.defaultCard = defaultCard;
    await cart.save();
    return res.json({ succes: true });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const getCarts = async (req, res) => {
  try {
    const { user_id } = req.user;
    const cart = await Cart.findAll({ where: { userId: user_id } });

    return res.json({ succes: true, cards: cart });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

module.exports = {
  create,
  destroy,
  getCarts,
  edit,
};
