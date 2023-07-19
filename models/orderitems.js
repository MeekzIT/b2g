"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderItems.init(
    {
      orderId: DataTypes.INTEGER,
      menuItemId: DataTypes.INTEGER,
      count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "OrderItems",
    }
  );

  let Order = sequelize.define("Order");
  let MenuItem = sequelize.define("MenuItem");

  OrderItems.hasMany(Order, {
    foreignKey: "id",
    as: "orderItems",
  });

  OrderItems.belongsTo(MenuItem, {
    foreignKey: "menuItemId",
    as: "menuItems",
  });
  return OrderItems;
};
