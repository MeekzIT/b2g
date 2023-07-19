"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Card.init(
    {
      userId: DataTypes.INTEGER,
      accountNumber: DataTypes.STRING,
      expiry: DataTypes.STRING,
      name: DataTypes.STRING,
      defaultCard: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Card",
    }
  );
  return Card;
};
