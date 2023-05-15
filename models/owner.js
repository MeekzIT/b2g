"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Owner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Owner.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      token: DataTypes.STRING,
      role: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      phone: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Owner",
    }
  );

  let Point = sequelize.define("Point");
  let MenuItem = sequelize.define("MenuItem");

  Owner.hasMany(Point, {
    foreignKey: "ownerId",
    as: "points",
  });

  Owner.hasMany(MenuItem, {
    foreignKey: "ownerId",
    as: "owner",
  });

  return Owner;
};
