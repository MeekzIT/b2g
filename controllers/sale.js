const Sale = require("../models").Sale;
const MenuItem = require("../models").MenuItem;

const create = async (req, res) => {
  try {
    const { discount, promocode, menuItemId } = req.body;
    const menuItem = await MenuItem.findOne({
      where: { id: menuItemId },
    });
    let discountValue = (Number(menuItem.price) * Number(discount)) / 100;

    await Sale.create({
      discount,
      promocode,
      menuItemId,
      discountPrice: Number(menuItem.price) - discountValue,
    });

    return res.json({
      succes: true,
    });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const edit = async (req, res) => {
  try {
    const { id, discount, promocode, menuItemId } = req.body;
    const menuItem = await MenuItem.findOne({
      where: { id: menuItemId },
    });

    const sale = await Sale.findOne({
      where: { id },
    });

    let discountValue = (Number(menuItem.price) * Number(discount)) / 100;

    sale.discount = discount;
    sale.promocode = promocode;
    sale.discountPrice = discountValue;
    await sale.save();
    return res.json({
      succes: true,
    });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.body;

    const sale = await Sale.findOne({
      where: { id },
    });

    await sale.destroy();
    return res.json({
      succes: true,
    });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

module.exports = {
  create,
  edit,
  destroy,
};
