"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FeedBack extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FeedBack.init(
    {
      name: DataTypes.STRING,
      text: DataTypes.STRING,
      menuItemId: DataTypes.INTEGER,
      hide: DataTypes.BOOLEAN,
      ownerId:DataTypes.INTEGER,
      pointId:DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "FeedBack",
    }
  );
  let MenuItem = sequelize.define("MenuItem");

  FeedBack.belongsTo(MenuItem, {
    foreignKey: "menuItemId",
    as: "feedBacks",
  });

  return FeedBack;
};
