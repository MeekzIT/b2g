"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Basket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Basket.init(
    {
      userId: DataTypes.INTEGER,
      menuItemId: DataTypes.INTEGER,
      count: DataTypes.INTEGER,
      pointId: DataTypes.INTEGER,
      ownerid: DataTypes.INTEGER,
      addressHy: DataTypes.STRING,
      addressEn: DataTypes.STRING,
      addressRu: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Basket",
    }
  );

  let MenuItem = sequelize.define("MenuItem");
  Basket.belongsTo(MenuItem, {
    foreignKey: "menuItemId",
    // as: "productItem",
  });
  return Basket;
};
