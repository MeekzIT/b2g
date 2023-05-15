"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Point extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Point.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      token: DataTypes.STRING,
      role: DataTypes.STRING,
      ownerId: DataTypes.INTEGER,
      addressHy: DataTypes.STRING,
      addressRu: DataTypes.STRING,
      addressEn: DataTypes.STRING,
      lat: DataTypes.STRING,
      lng: DataTypes.STRING,
      phone: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Point",
    }
  );

  let Owner = sequelize.define("Owner");
  let MenuItem = sequelize.define("MenuItem");

  Point.belongsTo(Owner, {
    foreignKey: "id",
    as: "points",
  });

  Point.hasMany(MenuItem, {
    foreignKey: "pointId",
    as: "menuItems",
  });

  return Point;
};
