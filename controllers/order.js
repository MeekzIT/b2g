const Order = require("../models").Order;
const OrderItems = require("../models").OrderItems;
const MenuItem = require("../models").MenuItem;
const Sale = require("../models").Sale;

function generateOrderCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetter = letters[Math.floor(Math.random() * letters.length)];

  const randomNumber = Math.floor(Math.random() * 90) + 10;

  const orderCode = `${randomLetter}${randomNumber}`;

  return orderCode;
}

const checkCard = async (req, res) => {
  try {
    const { cardId, cvv, data } = req.body;
    const code = 7561;
    return res.json({ success: true, code });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const checkCode = async (req, res) => {
  try {
    const { user_id } = req.user;

    const { confirmationCode, pointId, ownerId, data, cardId, takeTime } =
      req.body;
    // {
    //  menuItemId:,
    // count:
    // }
    // code: DataTypes.STRING,
    const code = generateOrderCode();
    if (confirmationCode == 7561) {
      const order = await Order.create({
        pointId,
        ownerId,
        cardId,
        takeTime,
        active: true,
        paymentStatus: "success",
        userId: user_id,
        code,
      });
      data.map(async (d) => {
        await OrderItems.create({
          orderId: order.id,
          menuItemId: d.menuItemId,
          count: d.count,
        });
      });

      return res.json({ success: true, code });
    } else {
      return res.json({ success: false });
    }
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const pointOrders = async (req, res) => {
  try {
    const { pointId, active } = req.query;
    const pointItems = await Order.findAll({
      where: { pointId, active },
      include: [
        {
          model: OrderItems,
          as: "orderItems",
          include: [{ model: MenuItem, as: "orderMenuItems" }],
        },
      ],
    });
    return res.json({ success: true, data: pointItems });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const getMyOrders = async (req, res) => {
  try {
    const { user_id } = req.user;
    const pointItems = await Order.findAll({
      where: { userId: user_id },
      include: [
        {
          model: OrderItems,
          as: "orderItems",
          include: [{ model: MenuItem, as: "orderMenuItems" }],
        },
      ],
    });
    return res.json({ success: true, data: pointItems });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const takeOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const orderItem = await Order.findOne({
      where: { id: orderId },
    });
    orderItem.active = false;
    await orderItem.save();
    return res.json({ success: true });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

module.exports = {
  checkCard,
  checkCode,
  pointOrders,
  getMyOrders,
  takeOrder,
};
