const Cart = require("../models").Card;

const create = async (req, res) => {
  try {
    const { accounts, date, name } = req.body;
    const { user_id } = req.user;

    await Cart.create({
      userId: user_id,
      accounts,
      date,
      name,
    });
    return res.json({ succes: true });
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

const getCarts = async (req, res) => {
  try {
    const { user_id } = req.user;
    const cart = await Cart.findAll({ where: { id: user_id } });

    return res.json({ succes: true, carts: cart });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

module.exports = {
  create,
  destroy,
  getCarts,
};
