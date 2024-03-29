"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Points", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      token: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.STRING,
      },
      ownerId: {
        type: Sequelize.INTEGER,
      },
      active: {
        type: Sequelize.BOOLEAN,
      },
      phone: {
        type: Sequelize.STRING,
      },
      image:Sequelize.STRING,
      addressHy: Sequelize.STRING,
      addressRu: Sequelize.STRING,
      addressEn: Sequelize.STRING,
      lat: {
        type: Sequelize.STRING,
      },
      lng: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Points");
  },
};
