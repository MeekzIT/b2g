"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MenuItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MenuItem.init(
    {
      image: DataTypes.STRING,
      nameHy: DataTypes.STRING,
      nameRu: DataTypes.STRING,
      nameEn: DataTypes.STRING,
      descHy: DataTypes.STRING,
      descRu: DataTypes.STRING,
      descEn: DataTypes.STRING,
      price: DataTypes.STRING,
      rating: DataTypes.STRING,
      pointId: DataTypes.INTEGER,
      ownerId: DataTypes.INTEGER,
      activity: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "MenuItem",
    }
  );

  let Point = sequelize.define("Point");
  let Sale = sequelize.define("Sale");
  let Owner = sequelize.define("Owner");
  let FeedBack = sequelize.define("FeedBack");
  let Basket = sequelize.define("Basket");
  let OrderItems = sequelize.define("OrderItems");

  MenuItem.belongsTo(Point, {
    foreignKey: "id",
    as: "menuItems",
  });

  MenuItem.belongsTo(Owner, {
    foreignKey: "id",
    as: "owner",
  });

  MenuItem.hasOne(Sale, {
    foreignKey: "menuItemId",
    as: "sales",
  });

  MenuItem.hasMany(FeedBack, {
    foreignKey: "id",
    as: "feedBacks",
  });

  MenuItem.hasOne(Basket, {
    foreignKey: "id",
    // as: "menuItemId",
  });

  MenuItem.belongsTo(OrderItems, {
    foreignKey: "id",
    as: "orderMenuItems",
  });

  return MenuItem;
};
