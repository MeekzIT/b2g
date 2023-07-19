const Basket = require("../models").Basket;
const MenuItem = require("../models").MenuItem;
const Point = require("../models/").Point;

const create = async (req, res) => {
  try {
    const { menuItemId, count } = req.body;
    const { user_id } = req.user;
    let menuItem = await MenuItem.findOne({ where: { id: menuItemId } });
    const point = await Point.findOne({
      where: { id: menuItem.pointId },
    });
    await Basket.create({
      userId: user_id,
      menuItemId,
      count,
      pointId: menuItem.pointId,
      ownerid: menuItem.ownerId,
      addressHy: point.addressHy,
      addressEn: point.addressEn,
      addressRu: point.addressRu,
    });
    return res.json({ succes: true });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const edit = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { id, count } = req.body;
    const basketItem = await Basket.findOne({
      where: { userId: user_id, menuItemId: id },
    });
    basketItem.count = count;
    await basketItem.save();
    return res.json({ succes: true });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.body;
    const { user_id } = req.user;
    const basketItem = await Basket.findOne({
      where: { userId: user_id, menuItemId: id },
    });
    await basketItem.destroy();
    return res.json({ succes: true });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const getAll = async (req, res) => {
  try {
    const { user_id } = req.user;
    const basketItems = await Basket.findAll({
      where: { userId: user_id },
      include: [
        {
          model: MenuItem,
        },
      ],
    });
    const items = [];
    await basketItems.map(
      async ({
        userId,
        pointId,
        ownerId,
        count,
        createdAt,
        updatedAt,
        MenuItem,
        addressHy,
        addressEn,
        addressRu,
      }) => {
        const existingCartIndex = items.findIndex(
          (cartItem) => cartItem.pointId === pointId
        );
        if (existingCartIndex === -1) {
          items.push({
            pointId,
            ownerId,
            userId,
            createdAt,
            updatedAt,
            addressHy,
            addressEn,
            addressRu,
            products: [{ ...MenuItem.dataValues, count }],
          });
        } else {
          items[existingCartIndex].products.push({
            ...MenuItem.dataValues,
            count,
          });
        }
      }
    );

    return res.json({ succes: true, items });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

module.exports = {
  create,
  edit,
  destroy,
  getAll,
};
