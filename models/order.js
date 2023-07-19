"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init(
    {
      pointId: DataTypes.INTEGER,
      ownerId: DataTypes.INTEGER,
      active: DataTypes.BOOLEAN,
      code: DataTypes.STRING,
      paymentStatus: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      cardId: DataTypes.INTEGER,
      takeTime: DataTypes.STRING,
      cvv: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );

  let OrderItems = sequelize.define("OrderItems");

  Order.hasMany(OrderItems, {
    foreignKey: "orderId",
    as: "orderItems",
  });
  return Order;
};
